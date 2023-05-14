import { join } from 'path';
import type { ExecResult } from './exec.js';
import type { Runners } from './runners.js';

export type PipelineStepDef<T> = {
  name: T;
  deps: T[];
  parallel?: T[];
};

export const ROOT = null;

export enum Pipeline {
  all,
  allFast,
  bump,
  docs,
  publish,
  test,
}

export enum Step {
  buildClikit,
  buildDocs,
  buildExample,
  buildTsRetype,
  buildUikit,
  buildVis,
  cleanClikit,
  cleanDocs,
  cleanExample,
  cleanTsRetype,
  cleanUikit,
  cleanVis,
  echo,
  format,
  generateReadme,
  generateThemes,
  generateVisDevData,
  install,
  installClikit,
  installDocs,
  installExample,
  installTsRetype,
  installUikit,
  installVis,
  prepareDist,
  runCreateCmdHelpSnippet,
  runExampleTsRetype,
  runExtractSnippets,
  smoke,
  syntaxHighlightSnippets,
  tests,
  testsFast,
  updateDist,
}

export const pipelines = new Set<Pipeline>([
  Pipeline.all,
  Pipeline.publish,
  Pipeline.bump,
  Pipeline.test,
  Pipeline.docs,
]);

export const steps: PipelineStepDef<Step>[] = [
  { name: Step.installClikit, deps: [Step.cleanClikit] },
  { name: Step.buildClikit, deps: [Step.installClikit] },
  {
    name: Step.buildDocs,
    deps: [
      Step.installDocs,
      Step.runExampleTsRetype,
      Step.runExtractSnippets,
      Step.syntaxHighlightSnippets,
    ],
  },
  { name: Step.buildExample, deps: [Step.runExtractSnippets] },
  { name: Step.buildTsRetype, deps: [Step.installTsRetype, Step.buildClikit] },
  { name: Step.buildUikit, deps: [Step.installUikit, Step.buildTsRetype] },
  { name: Step.buildVis, deps: [Step.installVis, Step.buildUikit, Step.generateThemes] },
  { name: Step.cleanDocs, deps: [] },
  { name: Step.cleanExample, deps: [] },
  { name: Step.cleanTsRetype, deps: [] },
  { name: Step.cleanUikit, deps: [] },
  { name: Step.cleanVis, deps: [] },
  { name: Step.format, deps: [Step.install] },
  { name: Step.generateReadme, deps: [Step.runExtractSnippets, Step.runCreateCmdHelpSnippet] },
  { name: Step.generateThemes, deps: [Step.buildUikit] },
  { name: Step.generateVisDevData, deps: [Step.buildTsRetype, Step.prepareDist] },
  { name: Step.install, deps: [] },
  { name: Step.installDocs, deps: [Step.install, Step.cleanDocs] },
  { name: Step.installExample, deps: [Step.cleanExample, Step.prepareDist] },
  { name: Step.installTsRetype, deps: [Step.install, Step.cleanTsRetype] },
  { name: Step.installUikit, deps: [Step.install, Step.cleanUikit] },
  { name: Step.installVis, deps: [Step.install, Step.cleanVis] },
  { name: Step.prepareDist, deps: [Step.buildVis, Step.buildTsRetype] },
  { name: Step.updateDist, deps: [] },
  { name: Step.echo, deps: [] },
  { name: Step.runCreateCmdHelpSnippet, deps: [Step.prepareDist] },
  { name: Step.runExampleTsRetype, deps: [Step.installExample] },
  { name: Step.runExtractSnippets, deps: [Step.runExampleTsRetype] },
  {
    name: Step.smoke,
    deps: [Step.runExampleTsRetype, Step.buildExample, Step.runExtractSnippets],
  },
  { name: Step.syntaxHighlightSnippets, deps: [Step.runExtractSnippets] },
  { name: Step.tests, deps: [Step.prepareDist] },
  { name: Step.testsFast, deps: [Step.prepareDist] },
];

export const pipelinesDefinitions = new Map<Pipeline, Step[]>([
  [
    Pipeline.all,
    [Step.tests, Step.smoke, Step.generateReadme, Step.buildDocs, Step.generateVisDevData],
  ],
  [
    Pipeline.allFast,
    [Step.testsFast, Step.smoke, Step.generateReadme, Step.buildDocs, Step.generateVisDevData],
  ],
  [Pipeline.docs, [Step.tests, Step.generateReadme, Step.buildDocs]],
  [Pipeline.publish, [Step.tests, Step.prepareDist]],
  [Pipeline.test, [Step.tests, Step.smoke]],
]);

export const createDefs = ({ rootDir, npm, npmrun, script }: { rootDir: string } & Runners) =>
  new Map<Step, () => Promise<ExecResult>>([
    [Step.buildDocs, () => npmrun('docs', 'build')],
    [Step.buildExample, () => npmrun('example', 'build')],
    [Step.buildTsRetype, () => npmrun('retype', 'build')],
    [Step.buildUikit, () => npmrun('uikit', 'build')],
    [Step.buildVis, () => npmrun('vis', 'build')],
    [Step.cleanDocs, () => npmrun('docs', 'clean')],
    [Step.cleanExample, () => npmrun('example', 'clean')],
    [Step.cleanTsRetype, () => npmrun('retype', 'clean')],
    [Step.cleanUikit, () => npmrun('uikit', 'clean')],
    [Step.cleanVis, () => npmrun('vis', 'clean')],
    [Step.echo, () => npm('example', ['run', 'check'])],
    [Step.format, () => npmrun(ROOT, 'format')],
    [Step.generateReadme, () => script('generateReadme')],
    [Step.generateThemes, () => script('generateThemes')],
    [
      Step.generateVisDevData,
      () =>
        npm(ROOT, [
          '-w',
          'retype',
          'run',
          'bin',
          '--',
          rootDir,
          '-c',
          '-j',
          join(rootDir, 'vis/src/data.json'),
        ]),
    ],
    [Step.install, () => npm(ROOT, ['install'])],
    [Step.installDocs, () => npm('docs', ['install'])],
    [Step.installExample, () => npm('example', ['install'])],
    [Step.installTsRetype, () => npm('retype', ['install'])],
    [Step.installUikit, () => npm('uikit', ['install'])],
    [Step.installVis, () => npm('vis', ['install'])],
    [Step.prepareDist, () => script('prepareDist')],
    [Step.runCreateCmdHelpSnippet, () => script('createCmdHelpSnippet')],
    [Step.runExampleTsRetype, () => npmrun('example', 'report')],
    [Step.runExtractSnippets, () => script('extractSnippets')],
    [Step.smoke, () => npmrun('example', 'smoke')],
    [Step.syntaxHighlightSnippets, () => script('syntaxHighlighting')],
    [Step.tests, () => npmrun(ROOT, 'test')],
    [Step.testsFast, () => npmrun(ROOT, 'test:fast')],
    [Step.updateDist, () => script('updateDist')],
  ]);
