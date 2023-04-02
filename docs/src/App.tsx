import { Bash } from './components/Bash';
import { Code } from './components/Code';
import { JsTsCode } from './components/JsTsCode';
import { Landing } from './components/Landing';
import { MultilangWindow } from './components/MultilangWindow';
import { Options } from './components/Options';
import { Window } from './components/Window';
import { Snippet } from './components/Token';
import Snippets from './generated/snippets';
import './App.styl';

const theme = 'light';
// const theme = 'dark';
// const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export default function App() {
  return (
    <main className={theme}>
      <section className="bleed" id="about">
        <Landing theme={theme} />
      </section>
      <section id="install">
        <h2>Install</h2>
        <p>Install as a dev dependency</p>
        <MultilangWindow
          theme={theme}
          codes={[
            { lang: 'npm', code: ['npm add -D ts-retype'] },
            { lang: 'yarn', code: ['yarn add -D ts-retype'] },
          ]}
        />
        <p>or install globally</p>
        <MultilangWindow
          theme={theme}
          codes={[
            { lang: 'npm', code: ['npm install -g ts-retype'] },
            { lang: 'yarn', code: ['yarn add global ts-retype'] },
          ]}
        />
      </section>
      <section id="usage">
        <h2>Usage</h2>
        <p>To create a report for your project, run</p>
        <MultilangWindow
          theme={theme}
          codes={[
            { lang: 'bash', code: ['ts-retype .'] },
            { lang: 'npx', code: ['npx ts-retype .'] },
          ]}
        />
        <p>Then open the report HTML file (this file is self contained and offline)</p>
        <Bash theme={theme}>{'open retype-report.html'}</Bash>
      </section>

      <section id="docs">
        <h2>CLI</h2>
        <p>Configuration can be done by either CLI options</p>
        <Window theme={theme} name="bash" showHeader={false}>
          <Code><span>{'ts-retype [options] <path-to-project>'}</span></Code>
        </Window>
        <Options
          options={[
            { short: 'c', long: 'config', args: '[path]', desc: 'load config - if no path provided, loads .retyperc from current directory. if not set, use default config' },
            { short: 'e', long: 'exclude', args: '[glob...]', desc: 'glob patterns that will be ignored' },
            { short: 'g', long: 'init', args: '[path]', desc: 'initializes with default config. if no path is provided, creates .retyperc in the current directory' },
            { short: 'i', long: 'include', args: '[glob...]', desc: 'glob patterns that will be included in search' },
            { short: 'j', long: 'json', args: '<path>', desc: 'JSON report file path. if not set, does not export JSON.' },
            { short: 'n', long: 'noHtml', desc: 'if set, does not export HTML (default: false)' },
            { short: 'o', long: 'output', args: '<path>', desc: 'HTML report file path - if provided with directory, it will create index.html file' },
          ]}
        />
        <p>Or by using the <strong>--config</strong> option and providing path to config .retyperc</p>
        <Bash theme={theme}>
          {
            `# generate .retyperc in the current directory
ts-retype -i
# run ts-retype using .retyperc in the current directory
ts-retype -c .`
          }
        </Bash>
        <p>An example of a <strong>.retyperc</strong> file</p>
        <JsTsCode theme={theme} snippet={Snippets.retyperc as Snippet} />
      </section>
      <section>
        <h2>ts-retype</h2>
        <p>You can also run it programatically, using ts-retype package.</p>
        <JsTsCode theme={theme} snippet={Snippets.tsRetype as Snippet} />
        <p>The input for <strong>scan</strong> is of type <strong>ScanArgs</strong></p>
        <JsTsCode theme={theme} snippet={Snippets.RetypeArgs as Snippet} />
        <p>An example for the snippets in the landing page would look like this</p>
        <JsTsCode theme={theme} snippet={Snippets.duplicate as Snippet} />
        <p>The return type of <strong>scan</strong> is an array of <strong>TypeDuplicate</strong></p>
        <JsTsCode theme={theme} snippet={Snippets.TypeDuplicate as Snippet} />
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
      <footer>

      </footer>
    </main>
  );
}
