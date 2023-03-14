import { Snippet } from './Snippet';
import { LiteralCluster } from '../../../vis/src/components/Cluster/LiteralCluster';
import './Demo.styl';
import { TypeIcon } from '../../../vis/src/components/Cluster/TypeIcon';
import { NamesListing } from '../../../vis/src/components/Cluster/NamesListing';
import { Logo } from './Logo';
import { Code, Window, WithBash } from './Window';

const exampleOne = {
  name: 'src/model.ts',
  code: `$com$// ...
$kew$export type $typ$User $pun$= $bra$\{
  $jkw$displayName$pun$: $typ$string$pun$;
  $jkw$email$pun$: $typ$string$pun$;
  $jkw$password$pun$: $typ$string$pun$;
$bra$}
$com$// ...`
};

const exampleTwo = {
  name: 'src/auth.ts',
  code: `$com$// ...
$kew$interface $typ$IUser $bra$\{
  $jkw$displayName$pun$: $typ$string$pun$;
  $jkw$email$pun$: $typ$string$pun$;
  $jkw$password$pun$: $typ$string$pun$;
$bra$}
$com$// ...`
};

const exampleThree = {
  name: 'src/api.ts',
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

const theme = 'light';
// const theme = 'dark';
// const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function Demo() {
  const contentMarkupx = (
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
    </div>
  );

  const contentMarkup = (
    <div className="similarity">
      <h1>Discover duplicate types in TypeScript code</h1>
      <p>TS retype searches for multiple declarations of the same Literal Types, Function Types and Enums/Unions.</p>
      <p>Run TS retype inside your project folder to get an HTML/JSON report.</p>
    </div>
  );

  return (
    <div className={`demo-container ${theme}`}>
      <div className="strip"></div>
      <div className="demo">
        <div className="demo-header">
          <Logo />
        </div>
        <div className="demo-menu">
          <a className="type active">About</a>
          <a className="type">Install</a>
          <a className="type">Usage</a>
          <a className="type">Examples</a>
          <div className="indicator"></div>
        </div>
        {/* <div className="description">
          <p>Static analysis tool for TypeScript that discovers similar types.</p>
        </div> */}
        <div className="snippets">
          <Snippet responsive theme={theme} start={11} code={exampleOne.code} name={exampleOne.name} />
          <Snippet responsive theme={theme} start={41} code={exampleTwo.code} name={exampleTwo.name} />
          <Snippet responsive theme={theme} start={75} code={exampleThree.code} name={exampleThree.name} />
        </div>
        {contentMarkup}

        <div className="code-install">
          {/* <div className="bash">npx ts-retype .</div> */}
          <div className="bash">
            <div className="tabs">
              <div className="tab tab-active">npm</div>
              <div className="tab">yarn</div>
              <div className="tab">npx</div>
            </div>
            <Window theme="dark" name="bash" showHeader={false}>
              <WithBash>
                <span>{'npm add -D ts-retype\n'}</span>
                <span>{'npx ts-retype .\n'}</span>
                <span>{'open retype-report.html'}</span>
              </WithBash>
            </Window>
          </div>
          <div className="links">
            <button className="link link-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
              </svg>
              <span>Documentation</span>
            </button>
            <button className="link link-secondary">
              <svg width="16" height="16" viewBox="0 0 256 249" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"><g fill="currentColor"><path d="M127.505 0C57.095 0 0 57.085 0 127.505c0 56.336 36.534 104.13 87.196 120.99 6.372 1.18 8.712-2.766 8.712-6.134 0-3.04-.119-13.085-.173-23.739-35.473 7.713-42.958-15.044-42.958-15.044-5.8-14.738-14.157-18.656-14.157-18.656-11.568-7.914.872-7.752.872-7.752 12.804.9 19.546 13.14 19.546 13.14 11.372 19.493 29.828 13.857 37.104 10.6 1.144-8.242 4.449-13.866 8.095-17.05-28.32-3.225-58.092-14.158-58.092-63.014 0-13.92 4.981-25.295 13.138-34.224-1.324-3.212-5.688-16.18 1.235-33.743 0 0 10.707-3.427 35.073 13.07 10.17-2.826 21.078-4.242 31.914-4.29 10.836.048 21.752 1.464 31.942 4.29 24.337-16.497 35.029-13.07 35.029-13.07 6.94 17.563 2.574 30.531 1.25 33.743 8.175 8.929 13.122 20.303 13.122 34.224 0 48.972-29.828 59.756-58.22 62.912 4.573 3.957 8.648 11.717 8.648 23.612 0 17.06-.148 30.791-.148 34.991 0 3.393 2.295 7.369 8.759 6.117 50.634-16.879 87.122-64.656 87.122-120.973C255.009 57.085 197.922 0 127.505 0"/><path d="M47.755 181.634c-.28.633-1.278.823-2.185.389-.925-.416-1.445-1.28-1.145-1.916.275-.652 1.273-.834 2.196-.396.927.415 1.455 1.287 1.134 1.923M54.027 187.23c-.608.564-1.797.302-2.604-.589-.834-.889-.99-2.077-.373-2.65.627-.563 1.78-.3 2.616.59.834.899.996 2.08.36 2.65M58.33 194.39c-.782.543-2.06.034-2.849-1.1-.781-1.133-.781-2.493.017-3.038.792-.545 2.05-.055 2.85 1.07.78 1.153.78 2.513-.019 3.069M65.606 202.683c-.699.77-2.187.564-3.277-.488-1.114-1.028-1.425-2.487-.724-3.258.707-.772 2.204-.555 3.302.488 1.107 1.026 1.445 2.496.7 3.258M75.01 205.483c-.307.998-1.741 1.452-3.185 1.028-1.442-.437-2.386-1.607-2.095-2.616.3-1.005 1.74-1.478 3.195-1.024 1.44.435 2.386 1.596 2.086 2.612M85.714 206.67c.036 1.052-1.189 1.924-2.705 1.943-1.525.033-2.758-.818-2.774-1.852 0-1.062 1.197-1.926 2.721-1.951 1.516-.03 2.758.815 2.758 1.86M96.228 206.267c.182 1.026-.872 2.08-2.377 2.36-1.48.27-2.85-.363-3.039-1.38-.184-1.052.89-2.105 2.367-2.378 1.508-.262 2.857.355 3.049 1.398"/></g></svg>
              <span>See on Github</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}