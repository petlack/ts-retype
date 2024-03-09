import { IconDocs, IconGithub } from '@ts-retype/uikit';
import { Button } from '@ts-retype/uikit';
import type { Snippet } from '@ts-retype/retype';
import { MultilangWindow } from '@ts-retype/uikit';
import { TsSnippet } from '@ts-retype/uikit';
import * as Snippets from '../generated/snippets';
import './Landing.styl';

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

  return (
    <div className={`landing-container ${theme}`}>
      <div className="landing">
        {/* <div className="description">
          <p>Static analysis tool for TypeScript that discovers similar types.</p>
        </div> */}
        <div className="snippets">
          <TsSnippet responsive theme={theme} start={11} snippet={Snippets.Snippet_type as Snippet} name={'src/model.ts'} />
          <TsSnippet responsive theme={theme} start={41} snippet={Snippets.Snippet_interface as Snippet} name={'src/auth.ts'} />
          <TsSnippet responsive theme={theme} start={75} snippet={Snippets.Snippet_function as Snippet} name={'src/api.ts'} />
        </div>
        <div className="description">
          <h1>Discover duplicate types in TypeScript code</h1>
          <p>TS retype statically analyzes code and searches for multiple declarations of the same Literal Types, Function Types and Enums/Unions.</p>
          <p>Run TS retype inside your project folder to get an HTML/JSON report.</p>
        </div>
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
            <Button caption="Docs" icon={IconDocs} style="primary" size="xl" kind="link" href="#docs" />
            <Button caption="Source" icon={IconGithub} style="secondary" size="xl" kind="link" href="https://github.com/petlack/ts-retype" newWindow />
          </div>
        </div>
      </div>
    </div>
  );
}