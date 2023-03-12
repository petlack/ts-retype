import { Snippet } from './Snippet';
import { LiteralCluster } from '../../../vis/src/components/Cluster/LiteralCluster';
import './Demo.styl';
import { TypeIcon } from '../../../vis/src/components/Cluster/TypeIcon';
import { NamesListing } from '../../../vis/src/components/Cluster/NamesListing';
import { Logo } from './Logo';

const exampleOne = {
  name: 'src/model/user.ts',
  code: `$g$// ...
$p$export type $y$User $b$= $o$\{
  $r$displayName$w$: $y$string$w$;
  $r$email$w$: $y$string$w$;
  $r$password$w$: $y$string$w$;
$o$}
$g$// ...`
};

const exampleTwo = {
  name: 'src/auth-module/auth.ts',
  code: `$g$// ...
$p$interface $y$IUser $o$\{
  $r$displayName$w$: $y$string$w$;
  $r$email$w$: $y$string$w$;
  $r$password$w$: $y$string$w$;
$o$}
$g$// ...`
};

const exampleThree = {
  name: 'src/api-module/user.ts',
  code: `$g$// ...
$p$async function $b$saveUser$o$(
  $r$user$w$: $p$\{
    $r$displayName$w$: $y$string$w$,
    $r$email$w$: $y$string$w$,
    $r$password$w$: $y$string$w$
  $p$}$o$) $o$\{
  $p$await $y$db$w$.$b$createUser$p$($r$user$p$)$w$;
$o$}
$g$// ...`
};

export function Demo() {
  return (
    <div className="demo-container">
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
          <Snippet start={11} code={exampleOne.code} name={exampleOne.name} />
          <Snippet start={41} code={exampleTwo.code} name={exampleTwo.name} />
          <Snippet start={75} code={exampleThree.code} name={exampleThree.name} />
        </div>
        <div className="similarity">
          <LiteralCluster
            type="interface"
            files={[
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
          {/* <div className="cluster">
            <div className="title">
              <TypeIcon type={'function'} />
              <NamesListing names={{ ParseFn: 1 }} query="" />
            </div>
          </div>
          <div className="cluster">
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