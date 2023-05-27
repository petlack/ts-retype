import { TS_RETYPE_CMD_OPTIONS } from '@ts-retype/retype';
import type { Snippet } from '@ts-retype/retype';
import * as Snippets from '../generated/snippets';
import { Bash, Code, JsTsCode, MultilangWindow, Options, ThemeMode, Window, useTheme } from '@ts-retype/uikit';

import './Docs.styl';

export function Docs() {
  const { theme } = useTheme();
  const mode = theme.name as ThemeMode;
  return (
    <>
      <section id="install">
        <h2>Install</h2>
        <p>Install as a dev dependency</p>
        <MultilangWindow
          theme={mode}
          codes={[
            { lang: 'npm', code: ['npm add -D ts-retype'] },
            { lang: 'yarn', code: ['yarn add -D ts-retype'] },
          ]} />
        <p>or install globally</p>
        <MultilangWindow
          theme={mode}
          codes={[
            { lang: 'npm', code: ['npm install -g ts-retype'] },
            { lang: 'yarn', code: ['yarn add global ts-retype'] },
          ]} />
      </section>

      <section id="usage">
        <h2>Usage</h2>
        <p>To create a report for your project, run</p>
        <MultilangWindow
          theme={mode}
          codes={[
            { lang: 'bash', code: ['ts-retype .'] },
            { lang: 'npx', code: ['npx ts-retype .'] },
          ]} />
        <p>Then open the report HTML file (this file is self contained and offline)</p>
        <Bash theme={mode}>{'open retype-report.html'}</Bash>
      </section>

      <section id="docs">
        <h2>CLI</h2>
        <p>Configuration can be done by either CLI options</p>
        <Window theme={mode} name="bash" showHeader={false}>
          <Code><span>{'ts-retype [options] <path-to-project>'}</span></Code>
        </Window>
        <Options options={TS_RETYPE_CMD_OPTIONS} />
        <p>Or by using the <strong>--config</strong> option and providing path to config .retyperc</p>
        <Bash theme={mode}>
          {`# generate .retyperc in the current directory
ts-retype -i
# run ts-retype using .retyperc in the current directory
ts-retype -c .`}
        </Bash>
        <p>An example of a <strong>.retyperc</strong> file</p>
        <JsTsCode theme={mode} snippet={Snippets.Snippet_retyperc as Snippet} />
      </section>

      <section>
        <h2>ts-retype</h2>
        <p>You can also run it programatically, using ts-retype package.</p>
        <JsTsCode theme={mode} snippet={Snippets.Snippet_tsRetype as Snippet} />
        <p>The input for <strong>scan</strong> is of type <strong>ScanProps</strong></p>
        <JsTsCode theme={mode} snippet={Snippets.Snippet_ScanProps as Snippet} />
        <p>An example for the snippets in the landing page would look like this</p>
        <JsTsCode theme={mode} snippet={Snippets.Snippet_duplicate as Snippet} />
        <p>The return type of <strong>scan</strong> is an array of <strong>TypeDuplicate</strong></p>
        <JsTsCode theme={mode} snippet={Snippets.Snippet_TypeDuplicate as Snippet} />
      </section>

      <section id="examples">
        <h2>Examples</h2>
        <p>See example reports for following projects</p>
        <ul>
          <li><a href="./report-ts-retype.html" target="_blank">petlack/ts-retype</a></li>
          <li><a href="./report-apollo-client.html" target="_blank">apollographql/apollo-client</a></li>
          <li><a href="./report-apollo-server.html" target="_blank">apollographql/apollo-server</a></li>
        </ul>
      </section>
    </>
  );
}
