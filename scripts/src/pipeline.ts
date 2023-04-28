import colors from 'colors';
import { difference, reverse } from 'ramda';

export type PipelineStepDef<T> = {
  name: keyof T;
  deps: (keyof T)[];
  parallel?: (keyof T)[];
};

const log = console.log.bind(console, colors.gray('[make]'));
const line = (...args: unknown[]) => {
  process.stdout.write(`${colors.gray('[make]')} ${args.join(' ')}`);
};
const eol = (...args: unknown[]) => {
  process.stdout.write(args.join(' '));
  process.stdout.write('\n');
};

function formatDuration(later: Date, earlier: Date) {
  let seconds = (later.getTime() - earlier.getTime()) / 1000;
  if (seconds < 60) {
    return `00:${seconds.toFixed(2).padStart(5, '0')}`;
  }
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return `${minutes.toFixed().padStart(2, '0')}:${seconds.toFixed(2).padStart(5, '0')}`;
}

function setFnName(fn: () => unknown, name: string) {
  const descriptor = Object.getOwnPropertyDescriptor(fn, 'name');
  if (descriptor) {
    descriptor.value = name;
    Object.defineProperty(fn, 'name', descriptor);
  }
}

export type ParallelOptions = {
  name?: string;
};
export function parallel(fns: (() => Promise<unknown>)[], { name }: ParallelOptions = {}) {
  const runner = async () => {
    await Promise.all(fns.map((step) => step()));
  };
  setFnName(runner, name || fns.map((fn) => fn.name).join(', '));
  return runner;
}

async function executeStep(step: () => Promise<unknown>) {
  line(`${colors.bold.white(step.name).padEnd(45, ' ')} ... `);
  const start = new Date();
  let status = colors.bold.green('done');
  let error = null;
  try {
    await step();
  } catch (err: unknown) {
    error = err;
    console.error(err);
    status = colors.bold.red('fail');
  }
  const end = new Date();
  eol(`${status} in ${formatDuration(end, start)}`);
  return { status, error };
}

export async function pipeline(steps: (() => Promise<unknown>)[]): Promise<void> {
  const start = new Date();
  let status = colors.bold.green('done');
  for (const step of steps) {
    const res = await executeStep(step);
    status = res.status;
    if (res.error) {
      break;
    }
  }
  log(`pipeline ${status} in ${formatDuration(new Date(), start)}`);
}

export function plan<T>(defs: T, steps: PipelineStepDef<T>[], target: (keyof typeof defs)[]) {
  const init = new Map<keyof T, PipelineStepDef<T>>();
  const stepsByName = steps.reduce((res, item) => res.set(item.name, item), init);
  const deps: (keyof T)[] = [];
  for (const dep of reverse(target)) {
    deps.push(dep);
  }
  for (const dep of target) {
    deps.push(
      ...plan(
        defs,
        steps,
        (stepsByName.get(dep)?.deps || []).filter((dep) => !deps.includes(dep)),
      ).filter((dep) => !deps.includes(dep)),
    );
  }
  return deps;
}

export function makeSequence<T>(
  defs: T,
  steps: PipelineStepDef<T>[],
  target: (keyof typeof defs)[],
) {
  const sequence = plan(defs, steps, target);
  return reverse(sequence).map((key) => defs[key]);
}

export function isBefore<Key>(
  previousSteps: Map<Key, Set<Key>>,
  nextSteps: Map<Key, Set<Key>>,
  earlier: Key,
  later: Key,
): boolean {
  if (!previousSteps.get(later)?.size && !previousSteps.get(earlier)?.size) {
    return true;
  }
  if (!previousSteps.get(later)?.size) {
    return false;
  }
  if (nextSteps.get(earlier)?.has(later)) {
    return true;
  }

  return [...(previousSteps.get(later)?.keys() || [])].reduce(
    (res, item) => res || isBefore(previousSteps, nextSteps, earlier, item),
    false,
  );
}

export function makePrevious<T>(steps: PipelineStepDef<T>[], target: (keyof T)[]) {
  type Key = keyof T;

  const stepsByName = steps.reduce(
    (res, item) => res.set(item.name, item),
    new Map<keyof T, PipelineStepDef<T>>(),
  );

  const previousSteps = new Map<Key, Set<Key>>();
  function traversePlan(step: Key) {
    if (!previousSteps.has(step)) {
      previousSteps.set(step, new Set<Key>());
    }
    for (const nextStep of stepsByName.get(step)?.deps || []) {
      previousSteps.get(step)?.add(nextStep);
      traversePlan(nextStep);
    }
  }
  target.forEach(traversePlan);
  return previousSteps;
}

export function makeNext<Key>(previous: Map<Key, Set<Key>>) {
  return [...previous.entries()].reduce((res, [key, deps]) => {
    for (const dep of deps) {
      if (!res.has(dep)) {
        res.set(dep, new Set<Key>());
      }
      res.get(dep)?.add(key);
    }
    return res;
  }, new Map<Key, Set<Key>>());
}

export function getEntrypoints<Key>(previous: Map<Key, Set<Key>>) {
  return [...previous.keys()].filter((key) => previous.get(key)?.size === 0);
}

export function getAllVisited<Key>(previous: Map<Key, Set<Key>>, target: Key[]) {
  const allSteps = new Set<Key>();
  function traverseNames(step: Key) {
    allSteps.add(step);
    [...(previous.get(step)?.keys() || [])].forEach(traverseNames);
  }
  target.forEach(traverseNames);
  return allSteps;
}

export function sortSteps<T>(steps: PipelineStepDef<T>[], target: (keyof T)[]): (keyof T)[] {
  const previous = makePrevious(steps, target);
  const next = makeNext(previous);
  const allSteps = getAllVisited(previous, target);
  const sorted = [...allSteps.values()].sort((a, b) => (isBefore(previous, next, a, b) ? -1 : 1));
  return sorted;
}

export function getStats<T>(steps: PipelineStepDef<T>[], plan: (keyof T)[]) {
  const all = steps.map((step) => step.name);
  const missing = difference(all, plan);

  return {
    missing,
    all,
    plan,
  };
}

export function printPipelineStats<T>(steps: PipelineStepDef<T>[], plan: (keyof T)[]) {
  const { missing, all } = getStats(steps, plan);
  const msg = [
    `not running ${colors.bold.yellow(missing.join(' '))}`,
    `running ${colors.bold.white(plan.join(' '))}`,
  ].join('\n');
  log(msg);
}