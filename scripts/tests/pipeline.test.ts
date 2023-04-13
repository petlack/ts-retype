import { isBefore, makeNext, makePrevious } from '../src/pipeline';

describe('', () => {
  const previousSteps = new Map([
    [0, new Set([] as number[])],
    [1, new Set([0])],
    [2, new Set([0])],
    [3, new Set([1])],
    [4, new Set([2])],
    [5, new Set([3])],
  ]);
  const nextSteps = new Map([
    [0, new Set([1, 2])],
    [1, new Set([3])],
    [2, new Set([4])],
    [3, new Set([5])],
  ]);

  test('ok', () => {
    expect(isBefore(previousSteps, nextSteps, 0, 0)).toEqual(true);
  });
  test('ok', () => {
    expect(isBefore(previousSteps, nextSteps, 0, 1)).toEqual(true);
  });
  test('ok', () => {
    expect(isBefore(previousSteps, nextSteps, 0, 5)).toEqual(true);
  });
  test('ok', () => {
    expect(isBefore(previousSteps, nextSteps, 1, 5)).toEqual(true);
  });
  test('not ok', () => {
    expect(isBefore(previousSteps, nextSteps, 1, 0)).toEqual(false);
  });
  test('not ok', () => {
    expect(isBefore(previousSteps, nextSteps, 5, 1)).toEqual(false);
  });
});

describe('pipeline', () => {
  const steps = [
    { name: 'cleanExample', deps: [] },
    { name: 'cleanDocs', deps: [] },
    { name: 'cleanTsRetype', deps: [] },
    { name: 'cleanVis', deps: [] },
    { name: 'installDocs', deps: ['cleanDocs'] },
    { name: 'installTsRetype', deps: ['cleanTsRetype'] },
    { name: 'installVis', deps: ['cleanVis'] },
    { name: 'buildVis', deps: ['installVis'] },
    { name: 'buildTsRetype', deps: ['installTsRetype'] },
    { name: 'prepareDist', deps: ['buildVis', 'buildTsRetype'] },
    { name: 'installExample', deps: ['prepareDist'] },
    { name: 'buildExample', deps: ['installExample'] },
    { name: 'runCreateCmdHelpSnippet', deps: ['prepareDist'] },
    { name: 'runExampleTsRetype', deps: ['buildExample'] },
    { name: 'runExtractSnippets', deps: ['runExampleTsRetype', 'runCreateCmdHelpSnippet'] },
    { name: 'syntaxHighlightSnippets', deps: ['runExtractSnippets'] },
    { name: 'buildDocs', deps: ['installDocs', 'syntaxHighlightSnippets'] },
    { name: 'generateReadme', deps: ['runExtractSnippets'] },
    { name: 'format', deps: [] },
    { name: 'tests', deps: ['prepareDist'] },
    { name: 'smoke', deps: ['tests', 'runExampleTsRetype', 'runExtractSnippets'] },
  ];

  const previous = makePrevious(
    steps,
    steps.map(({ name }) => name),
  );
  const next = makeNext(previous);

  test('ok', () => {
    expect(isBefore(previous, next, 'buildVis', 'smoke')).toEqual(true);
  });
  test('ok', () => {
    expect(isBefore(previous, next, 'prepareDist', 'generateReadme')).toEqual(true);
  });
  test('ok', () => {
    expect(isBefore(previous, next, 'tests', 'tests')).toEqual(false);
  });
  test('ok', () => {
    expect(isBefore(previous, next, 'cleanExample', 'tests')).toEqual(true);
  });
  test('ok', () => {
    expect(isBefore(previous, next, 'cleanExample', 'format')).toEqual(true);
  });
  test('ok', () => {
    expect(isBefore(previous, next, 'format', 'format')).toEqual(true);
  });

  test('not ok', () => {
    expect(isBefore(previous, next, 'syntaxHighlightSnippets', 'cleanExample')).toEqual(false);
  });
  test('not ok', () => {
    expect(isBefore(previous, next, 'tests', 'installDocs')).toEqual(false);
  });
  test('not ok', () => {
    expect(isBefore(previous, next, 'installDocs', 'tests')).toEqual(false);
  });
});
