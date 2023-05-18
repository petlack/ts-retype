import React, { useEffect } from 'react';
import { Text, useApp } from 'ink';
import { Col, Json, burn } from '@ts-retype/clikit';
import { useFetch } from '@ts-retype/uikit/hooks';

function Response<T>({ url, method, body }: { url: string, method?: RequestInit['method'], body?: string }) {
  const { exit } = useApp();
  const data = useFetch<T>(url, { method: method || 'get', body });
  const markup = Array.isArray(data) ? (
    <>{data?.map((item: any, idx: number) => <Text key={idx}>{item?.toString()}</Text>)}</>
  ) : (
    <Json value={data} options={{ nice: true }} />
  );
  useEffect(() => {
    if (data?.data) {
      exit();
    }
  }, [data, exit]);
  return (
    <Col>
      {markup}
    </Col>
  );
}

async function run() {
  let output = '';
  // const props = { url: 'https://replicate.npmjs.com/_all_docs' };
  // const props = { url: 'https://opentdb.com/api.php?amount=1&category=18&difficulty=hard&type=boolean' };
  // const props = { url: 'https://v2.jokeapi.dev/joke/Any' };
  // const props = { url: 'https://meowfacts.herokuapp.com' };
  // const props = { url: 'http://colormind.io/api/', method: 'post', body: JSON.stringify({ model: 'default' }) };
  // const props = { url: 'https://emojihub.yurace.pro/api/random' };
  // const props = { url: 'https://api.coinlore.net/api/ticker/?id=90' };
  // const props = { url: 'http://api.open-notify.org/iss-now.json' };
  // const props = { url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=40.748817&lon=-73' };
  // const props = { url: 'https://geocode.xyz/40.748817,-73.01?geoit=json' };
  // const props = { url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd' };
  // const props = { url: 'https://api.coinpaprika.com/v1/tickers/eth-ethereum' };
  // const props = { url: 'https://api.chucknorris.io/jokes/random' };
  // const props = { url: 'https://en.wikipedia.org/api/rest_v1/page/random/summary' };
  const props = { url: 'http://localhost:3000/' };
  output = await burn(<Response {...props} />, { discreet: true });
  console.log('output length', output.length);
  console.log(output);
}

run();
