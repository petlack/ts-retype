import { Button, IconDocs, IconGithub, MultilangWindow, TsSnippet } from '@ts-retype/uikit';
import type { Snippet } from '@ts-retype/retype';
import * as Snippets from '../generated/snippets';
import './Landing.styl';

export type LandingProps = {
  theme: 'dark' | 'light';
}

export function Landing({ theme }: LandingProps) {
  return (
    <div className={`landing-container ${theme}`}>
      <div className="landing">
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
            <Button caption="Docs" icon={IconDocs} colorScheme="primary" size="xl" kind="link" href="#docs" />
            <Button caption="Source" icon={IconGithub} colorScheme="text" size="xl" kind="link" href="https://github.com/petlack/ts-retype" newWindow />
          </div>
        </div>
      </div>
    </div>
  );
}
