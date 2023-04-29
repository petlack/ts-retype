import { PipelineStepDef } from './pipeline.js';

export const ROOT = null;

export enum Pipeline {
  all,
  publish,
  bump,
  test,
  docs,
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
}

export const pipelines = new Set<Pipeline>([
  Pipeline.all,
  Pipeline.publish,
  Pipeline.bump,
  Pipeline.test,
  Pipeline.docs,
]);

export const steps: PipelineStepDef<Step>[] = [
  { name: Step.cleanExample, deps: [] },
  { name: Step.cleanDocs, deps: [] },
  { name: Step.cleanTsRetype, deps: [] },
  { name: Step.cleanUikit, deps: [] },
  { name: Step.cleanVis, deps: [] },
  { name: Step.install, deps: [] },
  { name: Step.format, deps: [Step.install] },
  { name: Step.installDocs, deps: [Step.install, Step.cleanDocs] },
  { name: Step.installTsRetype, deps: [Step.install, Step.cleanTsRetype] },
  { name: Step.installUikit, deps: [Step.install, Step.cleanUikit] },
  { name: Step.installVis, deps: [Step.install, Step.cleanVis] },
  { name: Step.buildUikit, deps: [Step.installUikit] },
  { name: Step.buildVis, deps: [Step.installVis, Step.buildUikit] },
  { name: Step.buildTsRetype, deps: [Step.installTsRetype] },
  { name: Step.prepareDist, deps: [Step.buildVis, Step.buildTsRetype] },
  { name: Step.tests, deps: [Step.prepareDist] },
  { name: Step.installExample, deps: [Step.cleanExample, Step.prepareDist] },
  { name: Step.buildExample, deps: [Step.runExtractSnippets] },
  { name: Step.runCreateCmdHelpSnippet, deps: [Step.prepareDist] },
  { name: Step.runExampleTsRetype, deps: [Step.installExample] },
  { name: Step.runExtractSnippets, deps: [Step.runExampleTsRetype] },
  { name: Step.syntaxHighlightSnippets, deps: [Step.runExtractSnippets] },
  {
    name: Step.buildDocs,
    deps: [
      Step.installDocs,
      Step.runExampleTsRetype,
      Step.runExtractSnippets,
      Step.syntaxHighlightSnippets,
    ],
  },
  { name: Step.generateReadme, deps: [Step.runExtractSnippets, Step.runCreateCmdHelpSnippet] },
  { name: Step.generateVisDevData, deps: [Step.buildTsRetype, Step.prepareDist] },
  {
    name: Step.smoke,
    deps: [Step.tests, Step.runExampleTsRetype, Step.buildExample, Step.runExtractSnippets],
  },
];

export const pipelinesDefinitions = new Map<Pipeline, Step[]>([
  [Pipeline.all, [Step.smoke, Step.generateReadme, Step.buildDocs, Step.generateVisDevData]],
  [Pipeline.publish, [Step.tests, Step.prepareDist]],
  [Pipeline.test, [Step.smoke]],
  [Pipeline.docs, [Step.tests, Step.generateReadme, Step.buildDocs]],
]);
