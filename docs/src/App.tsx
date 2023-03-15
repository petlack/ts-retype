import { Demo } from './components/Demo';
import { MultilangWindow } from './components/MultilangWindow';
import { Code, Window, WithBash } from './components/Window';
import './App.styl';
import { Options } from './components/Options';

export default function App() {
  return (
    <main>
      <section className="bleed">
        <Demo />
      </section>
      <section>
        <h2>Install</h2>
        <p>Install as a dev dependency</p>
        <MultilangWindow
          theme="light"
          codes={[
            { lang: 'npm', code: ['npm add -D ts-retype'] },
            { lang: 'yarn', code: ['yarn add -D ts-retype'] },
          ]}
        />
        <p>or install globally</p>
        <MultilangWindow
          theme="light"
          codes={[
            { lang: 'npm', code: ['npm install -g ts-retype'] },
            { lang: 'yarn', code: ['yarn add global ts-retype'] },
          ]}
        />
      </section>
      <section>
        <h2>Usage</h2>
        <p>To create a report for your project, run</p>
        <MultilangWindow
          theme="light"
          codes={[
            { lang: 'bash', code: ['ts-retype .'] },
            { lang: 'npx', code: ['npx ts-retype .'] },
          ]}
        />
        <p>Then open the report HTML file (this file is self contained and offline)</p>
        <div className="bash">
          <Window theme="light" name="bash" showHeader={false}>
            <WithBash>
              <span>{'open retype-report.html'}</span>
            </WithBash>
          </Window>
        </div>
      </section>

      <section>
        <h2>Docs</h2>
        <p>CLI options are as following</p>
        <p>Configuration can be done by either CLI options</p>
        <div className="bash">
          <Window theme="light" name="bash" showHeader={false}>
            <Code><span>{'ts-retype [options] <path-to-project>'}</span></Code>
          </Window>
        </div>
        <Options
          options={[
            { short: 'c', long: 'config', args: '[path]', desc: 'load config - if no path provided, loads .retyperc from current directory. if not set, use default config' },
            { short: 'e', long: 'exclude', args: '[glob...]', desc: 'glob patterns that will be ignored' },
            { short: 'g', long: 'generate', args: '[path]', desc: 'generate default config. if no path provided, creates .retyperc in the current directory' },
            { short: 'i', long: 'include', args: '[glob...]', desc: 'glob patterns that will be included in search' },
            { short: 'j', long: 'json', args: '<path>', desc: 'JSON report file path. if not set, does not export JSON.' },
            { short: 'n', long: 'noHtml', desc: 'if set, does not export HTML (default: false)' },
            { short: 'o', long: 'output', args: '<path>', desc: 'HTML report file path - if provided with directory, it will create index.html file' },
          ]}
        />
        <p>Or by using .retyperc</p>
        <Code>
          <span>
            {
              `{
  "output": "./retype-report.html",
  "include": ["**/*.{ts,tsx}"],
  "exclude": ["**/node_modules/**", "**/dist/**", "**/generated/**", "**/build/**"]
}`
            }  
          </span>
        </Code>
        <p>You can also run it programatically, using ts-retype package.</p>


        <Code>
          <span>
            {
              `type ClusterOutput = {
  name: string;
  files: {
    pos: [number, number];
    lines: number[];
    file: string;
    type: 'interface' | 'literal' | 'alias' | 'function' | 'enum' | 'union';
  }[];
  names: { [name: string]: number };
  group:
    0 | // different types
    3 | // renamed types
    4;  // identical types
  properties?: {
    key: string;
    value: string;
    type: string;
  }[];
  parameters?: {
    key: string;
    value: string;
    type: string;
  }[];
  returnType?: string;
  members?: string[];
  types?: string[];
}`
            }
          </span>
        </Code>
      </section>

      <section>
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
