import React from 'react';
import { Col, Fullscreen, Row, Tabbed, vanish } from '@ts-retype/clikit';
import { Text } from 'ink';

const Card: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Col airy grow>
    <Text>{children}</Text>
  </Col>
);

function Layout() {
  return (
    <Fullscreen>
      <Row center airy>
        <Text>HEADER</Text>
      </Row>
      <Row grow>
        <Row center width='30%'>
          <Text>SIDEBAR</Text>
        </Row>
        <Row width='70%'>
          <Tabbed grow labels={['Tab #1', 'Tab #2']}>
            <Card>Card #1</Card>
            <Card>Card #2</Card>
          </Tabbed>
        </Row>
      </Row>
    </Fullscreen>
  );
}

async function run() {
  vanish(<Layout />);
}

run();
