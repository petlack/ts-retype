import { PipelineStepDef } from './pipeline.js';

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
  buildDocs,
  buildExample,
  buildTsRetype,
  buildUikit,
  buildVis,
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
}

export const pipelines = new Set<Pipeline>([
  Pipeline.all,
  Pipeline.publish,
  Pipeline.bump,
  Pipeline.test,
  Pipeline.docs,
]);

export const steps: PipelineStepDef<Step>[] = [
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
  { name: Step.buildTsRetype, deps: [Step.installTsRetype] },
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
