import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { join } from 'path';
import { max, range, repeat } from 'ramda';

type Pane = {
  row: number;
  col: number;
  cmd: string;
};

interface Layout {
  panes: Pane[];
}

const withPaneIds: (panes: Pane[]) => (Pane & { pane: number })[][] = (panes) => {
  const maxCol = panes.map((pane) => pane.col).reduce(max);
  const columnsRows = panes.reduce((res, pane) => {
    res[pane.col].push(pane);
    return res;
  }, range(0, maxCol + 1).map(() => []) as Pane[][]);
  const panesIds = columnsRows.map((rows) =>
    rows.map((pane) => ({
      ...pane,
      pane: columnsRows[pane.col - 1].length + pane.row,
    })),
  );
  return panesIds;
};

function generateBashScript({
  layoutFile,
  sessionName,
  scriptPath,
}: {
  layoutFile: string;
  sessionName: string;
  scriptPath: string;
}) {
  const layout: Layout = yaml.load(fs.readFileSync(layoutFile, 'utf8')) as unknown as Layout;

  const header = [
    '#!/bin/bash',
    '',
    'WORKING_DIR=$PWD',
    '',
    'if [ -z "$TMUX" ]; then',
    `	SESSION_NAME="${sessionName}"`,
    '	tmux new-session -d -s $SESSION_NAME -c "$WORKING_DIR"',
    'else',
    '	tmux new-window -c "$WORKING_DIR"',
    "	SESSION_NAME=$(tmux display-message -p '#S')",
    'fi',
  ];

  const panesIds = withPaneIds(layout.panes);

  const columnsIds = range(1, panesIds.length);
  const columnsSplits = columnsIds.slice(1).map(() => 'tmux split-window -h -c "$WORKING_DIR"');
  const rowsSplits = columnsIds.map((col) => [
    `tmux select-pane -t ${panesIds[col][0].pane}`,
    ...repeat('tmux split-window -v -c "$WORKING_DIR"', panesIds[col].length - 1),
  ]);
  const flatSplits = panesIds.reduce((res, item) => [...res, ...item]);
  const flatRowSplits = rowsSplits.reduce((res, item) => [...res, ...item]);
  const commands = flatSplits.map(({ pane, cmd }) => `tmux send-keys -t ${pane} "${cmd}" C-m`);

  const footer = [
    'if [ -z "$TMUX" ]; then',
    '	tmux attach-session -t "$SESSION_NAME"',
    'else',
    '	tmux select-window -t "$(tmux display-message -p \'#I\')"',
    'fi',
  ];

  const script = [...header, ...columnsSplits, ...flatRowSplits, ...commands, ...footer];

  fs.writeFileSync(scriptPath, script.join('\n'));
  console.log(`bash script generated: ${scriptPath}`);
}

generateBashScript({
  layoutFile: join(process.cwd(), '..', '.tmux-layout.yaml'),
  sessionName: 'tmux-dev',
  scriptPath: join(process.cwd(), 'bin/tmux-start.sh'),
});
