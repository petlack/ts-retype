import { Button, Heading, IconDocs, IconGithub, MultilangWindow, TsSnippet } from '@ts-retype/uikit';
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
          <Heading as='h1'>Discover duplicate types in TypeScript code</Heading>
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
            <Button caption="Docs" leftIcon={IconDocs} colorScheme="primary" size="lg" kind="link" href="#docs">Docs</Button>
            <Button caption="Source" leftIcon={IconGithub} colorScheme="text" size="lg" kind="link" href="https://github.com/petlack/ts-retype">Source</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
