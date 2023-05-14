import React from 'react';
import { Box } from 'ink';
import { Json, vanish } from '@ts-retype/clikit';
import { useDimensions } from '@ts-retype/clikit';

function Examine({ state }: { state: unknown }) {
  const [width, height] = useDimensions();
  return (
    <Box width={width} height={height} alignItems='center' justifyContent='center' paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1}>
      <Json value={state} options={{ pretty: true, nice: true }} />
    </Box>
  );
}

async function run() {
  const json = {
    'data': {
      'response_code': 0,
      'results': [{
        'category': 'Science: Computers',
        'type': 'boolean',
        'difficulty': 'hard',
        'question': 'The T-Mobile Sidekick smartphone is are- branded version of the Danger Hiptop.', 'correct_answer': 'True', 'incorrect_answers': ['False']
      }]
    }
  };
  vanish(<Examine state={json} />);
}

run();
