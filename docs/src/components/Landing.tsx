import { MultilangWindow } from './MultilangWindow';
// import { Logo } from './Logo';
import { Snippet } from './Snippet';
import './Landing.styl';
import { TopBar } from '../uikit/TopBar';
import { Button } from '../uikit/Button';
import { IconDocs, IconGithub } from '../uikit/Icons';

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
$awa$async $kew$function $fun$saveUser$bra$(
  $jkw$user$pun$: $jbr$\{
    $jkw$displayName$pun$: $typ$string$pun$,
    $jkw$email$pun$: $typ$string$pun$,
    $jkw$password$pun$: $typ$string$pun$
  $jbr$}$bra$) $bra$\{
  $awa$await $var$db$pun$.$fun$createUser$jbr$($lva$user$jbr$)$pun$;
$bra$}
$com$// ...`
};

export type LandingProps = {
  theme: 'dark' | 'light';
}

export function Landing({ theme }: LandingProps) {
  // const contentMarkupx = (
  //   <div className="similarity">
  //     <LiteralCluster
  //       type="interface"
  //       files={[
  //         { file: 'src/model/user.ts', lines: [12, 16], pos: [0, 0], type: 'alias' },
  //         { file: 'src/auth-module/auth.ts', lines: [42, 46], pos: [0, 0], type: 'interface' },
  //         { file: 'src/api-module/user.ts', lines: [76, 83], pos: [0, 0], type: 'literal' },
  //         { file: 'src/model/user.ts', lines: [12, 16], pos: [0, 0], type: 'alias' },
  //         { file: 'src/auth-module/auth.ts', lines: [42, 46], pos: [0, 0], type: 'interface' },
  //         { file: 'src/api-module/user.ts', lines: [76, 83], pos: [0, 0], type: 'literal' },
  //         { file: 'src/model/user.ts', lines: [12, 16], pos: [0, 0], type: 'alias' },
  //         { file: 'src/auth-module/auth.ts', lines: [42, 46], pos: [0, 0], type: 'interface' },
  //         { file: 'src/api-module/user.ts', lines: [76, 83], pos: [0, 0], type: 'literal' },
  //       ]}
  //       name="IUser"
  //       names={{ User: 1, IUser: 1, anonymous: 1 }}
  //       group="Identical"
  //       pos={[0, 10]}
  //       properties={[
  //         { key: 'displayName', value: 'string', type: 'StringKeyword' },
  //         { key: 'email', value: 'string', type: 'StringKeyword' },
  //         { key: 'password', value: 'string', type: 'StringKeyword' },
  //       ]}
  //       query=""
  //     />
  //     <div className="cluster">
  //       <div className="title">
  //         <TypeIcon type={'function'} />
  //         <NamesListing names={{ ParseFn: 1 }} query="" />
  //       </div>
  //     </div>
  //   </div>
  // );

  const contentMarkup = (
    <div className="description">
      <h1>Discover duplicate types in TypeScript code</h1>
      <p>TS retype statically analyzes code and searches for multiple declarations of the same Literal Types, Function Types and Enums/Unions.</p>
      <p>Run TS retype inside your project folder to get an HTML/JSON report.</p>
    </div>
  );

  return (
    <div className={`landing-container ${theme}`}>
      <TopBar>
        <div className="topbar-menu">
          <a className="topbar-menu-item topbar-menu-item-active">About</a>
          <a className="topbar-menu-item">Install</a>
          <a className="topbar-menu-item">Usage</a>
          <a className="topbar-menu-item">Examples</a>
          <div className="indicator"></div>
        </div>
      </TopBar>
      <div className="landing">
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
          <MultilangWindow
            theme={{ dark: 'light', light: 'dark' }[theme] as 'dark' | 'light'}
            selectedLang="npx"
            codes={[
              { code: ['npm add -D ts-retype'], lang: 'npm' },
              { code: ['yarn add -D ts-retype'], lang: 'yarn' },
              { code: ['npx ts-retype .'], lang: 'npx' },
            ]}
          />
          <div className="links">
            <Button caption="Documentation" icon={IconDocs} kind="primary" />
            <Button caption="Source code" icon={IconGithub} kind="secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}