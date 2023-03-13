import { Snippet } from './Snippet';
import { LiteralCluster } from '../../../vis/src/components/Cluster/LiteralCluster';
import './Demo.styl';
import { TypeIcon } from '../../../vis/src/components/Cluster/TypeIcon';
import { NamesListing } from '../../../vis/src/components/Cluster/NamesListing';
import { Logo } from './Logo';

const exampleOne = {
  name: 'src/model/user.ts',
  code: `$com$// ...
$kew$export type $typ$User $pun$= $bra$\{
  $jkw$displayName$pun$: $typ$string$pun$;
  $jkw$email$pun$: $typ$string$pun$;
  $jkw$password$pun$: $typ$string$pun$;
$bra$}
$com$// ...`
};

const exampleTwo = {
  name: 'src/auth-module/auth.ts',
  code: `$com$// ...
$kew$interface $typ$IUser $bra$\{
  $jkw$displayName$pun$: $typ$string$pun$;
  $jkw$email$pun$: $typ$string$pun$;
  $jkw$password$pun$: $typ$string$pun$;
$bra$}
$com$// ...`
};

const exampleThree = {
  name: 'src/api-module/user.ts',
  code: `$com$// ...
$kew$async function $fun$saveUser$bra$(
  $jkw$user$pun$: $jbr$\{
    $jkw$displayName$pun$: $typ$string$pun$,
    $jkw$email$pun$: $typ$string$pun$,
    $jkw$password$pun$: $typ$string$pun$
  $jbr$}$bra$) $bra$\{
  $awa$await $var$db$pun$.$fun$createUser$jbr$($lva$user$jbr$)$pun$;
$bra$}
$com$// ...`
};

// const theme = 'light';
// const theme = 'dark';
const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function Demo() {
  return (
    <div className={`demo-container ${theme}`}>
      <div className="demo">
        <div className="demo-header">
          <Logo />
        </div>
        <div className="types">
          <a className="type active">About</a>
          <a className="type">Install</a>
          <a className="type">Usage</a>
          <a className="type">Examples</a>
          <div className="indicator"></div>
        </div>
        <div className="description">
          <p>Static analysis tool for TypeScript that discovers similar types.</p>
        </div>
        <div className="snippets">
          <Snippet theme={theme} start={11} code={exampleOne.code} name={exampleOne.name} />
          <Snippet theme={theme} start={41} code={exampleTwo.code} name={exampleTwo.name} />
          <Snippet theme={theme} start={75} code={exampleThree.code} name={exampleThree.name} />
        </div>
        <div className="similarity">
          <LiteralCluster
            type="interface"
            files={[
              { file: 'src/model/user.ts', lines: [12, 16], pos: [0, 0], type: 'alias' },
              { file: 'src/auth-module/auth.ts', lines: [42, 46], pos: [0, 0], type: 'interface' },
              { file: 'src/api-module/user.ts', lines: [76, 83], pos: [0, 0], type: 'literal' },
              { file: 'src/model/user.ts', lines: [12, 16], pos: [0, 0], type: 'alias' },
              { file: 'src/auth-module/auth.ts', lines: [42, 46], pos: [0, 0], type: 'interface' },
              { file: 'src/api-module/user.ts', lines: [76, 83], pos: [0, 0], type: 'literal' },
              { file: 'src/model/user.ts', lines: [12, 16], pos: [0, 0], type: 'alias' },
              { file: 'src/auth-module/auth.ts', lines: [42, 46], pos: [0, 0], type: 'interface' },
              { file: 'src/api-module/user.ts', lines: [76, 83], pos: [0, 0], type: 'literal' },
            ]}
            name="IUser"
            names={{ User: 1, IUser: 1, anonymous: 1 }}
            group="Identical"
            pos={[0, 10]}
            properties={[
              { key: 'displayName', value: 'string', type: 'StringKeyword' },
              { key: 'email', value: 'string', type: 'StringKeyword' },
              { key: 'password', value: 'string', type: 'StringKeyword' },
            ]}
            query=""
          />
          <div className="cluster">
            <div className="title">
              <TypeIcon type={'function'} />
              <NamesListing names={{ ParseFn: 1 }} query="" />
            </div>
          </div>
          {/* <div className="cluster">
            <div className="title">
              <TypeIcon type={'enum'} />
              <NamesListing names={{ StatusCode: 1 }} query="" />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}