import styled from "styled-components";

import { Bash, Example } from '@ts-retype/uikit';

import { App } from '@ts-retype/docs';

const Box = styled.div`
  font-family: system-ui, sans-serif;
  line-height: 1.4;
`;

export default function Index() {
  return (
    <div>
      <App />
      <Box>
        <h1>Styled Component</h1>
      </Box>
      <Bash theme="dark">{"echo foo"}</Bash>
      <Example />
    </div>
  );
}
