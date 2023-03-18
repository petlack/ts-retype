import { Landing } from './components/Landing';
import { MultilangWindow } from './components/MultilangWindow';
import { Code, Window } from './components/Window';
import './App.styl';
import { Options } from './components/Options';
import { Bash } from './components/Bash';
import { JsTsCode } from './components/JsTsCode';

export default function App() {
  return (
    <main>
      <section className="bleed">
        <Landing />
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
        <Bash>{'open retype-report.html'}</Bash>
      </section>

      <section>
        <h2>CLI</h2>
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
        <p>Or by using the <strong>--config</strong> option and providing path to config .retyperc</p>
        <Bash>
          {
            `# generate .retyperc in the current directory
ts-retype -g
# run ts-retype using .retyperc in the current directory
ts-retype -c .`
          }
        </Bash>
        <p>An example of a <strong>.retyperc</strong> file</p>
        <JsTsCode>
          {
            `$bra$\{
  $var$"output"$gen$: $str$"./retype-report.html"$gen$,
  $var$"include"$gen$: [$str$"**/*.{ts,tsx}"$gen$],
  $var$"exclude"$gen$: [$str$"**/node_modules/**"$gen$, $str$"**/dist/**"$gen$]
}`
          }  
        </JsTsCode>
      </section>
      <section>
        <h2>ts-retype</h2>
        <p>You can also run it programatically, using ts-retype package.</p>
        <JsTsCode>
          {
            `$kew$import $bra$\{ $gen$findDuplicateTypes $bra$} $kew$from $str$'ts-retype'$gen$;

$kew$const $var$duplicates $kew$= $kew$await $fun$findDuplicateTypes$bra$({
  $jkw$exclude$pun$: $bra$[$str$'**/node_modules/**'$pun$, $str$'**/dist/**'$bra$]$pun$,
  $jkw$include$pun$: $bra$[$str$'**/*.{ts,tsx}'$bra$],
  $jkw$project$pun$: $str$'/path/to/project'$pun$,
$bra$})$pun$;

$kew$for $bra$($kew$const $var$dup $kew$of $var$duplicates$bra$) {
  $var$console$pun$.$fun$log$bra$($var$dup$pun$.$lva$group, $var$dup$pun$.$lva$names, $var$dup$pun$.$lva$files$pun$);
$bra$}`
          }
        </JsTsCode>
        <p>The input for <strong>findDuplicateTypes</strong> is of type <strong>RetypeArgs</strong></p>
        <JsTsCode>
          {`$kew$type $fun$RetypeArgs$gen$ = {
  $var$exclude$gen$: $str$string$gen$[];
  $var$include$gen$: $str$string$gen$[];
  $var$output$gen$: $str$string$gen$;
  $var$project$gen$: $str$string$gen$;
  $var$json$gen$?: $str$string$gen$;
  $var$noHtml$gen$?: $str$boolean$gen$;
}`}
        </JsTsCode>
        <p>An example for the snippets in the landing page would look like this</p>
        <JsTsCode>
          {
            `$kew$const $var$duplicate$gen$: $fun$TypeDuplicate $gen$= {
  $var$files$gen$: [
    { $var$file$gen$: $str$'src/model.ts'$gen$, $var$lines$gen$: [12, 16], $var$type$gen$: $str$'alias'$gen$ },
    { $var$file$gen$: $str$'src/auth.ts'$gen$, $var$lines$gen$: [42, 46], $var$type$gen$: $str$'interface'$gen$ },
    { $var$file$gen$: $str$'src/api.ts'$gen$, $var$lines$gen$: [76, 83], $var$type$gen$: $str$'literal'$gen$ },
  ],
  $var$group$gen$: 'renamed',
  $var$names$gen$: [
    { $var$name$gen$: $str$'IUser'$gen$, $var$count$gen$: 1 },
    { $var$name$gen$: $str$'User'$gen$, $var$count$gen$: 1 },
    { $var$name$gen$: $str$'anonymous'$gen$, $var$count$gen$: 1 },
  ],
  $var$properties$gen$: [
    { $var$name$gen$: $str$'displayName'$gen$, $var$type$gen$: $str$'string'$gen$ },
    { $var$name$gen$: $str$'email'$gen$, $var$type$gen$: $str$'string'$gen$ },
    { $var$name$gen$: $str$'password'$gen$, $var$type$gen$: $str$'string'$gen$ },
  ]
}`
          }
        </JsTsCode>
        <p>The return type of <strong>findDuplicateTypes</strong> is an array of <strong>TypeDuplicate</strong></p>
        <JsTsCode>
          {
            `$kew$type $fun$TypeDuplicate $gen$= {
  $var$files$gen$: {
    $var$file$gen$: $str$string$gen$;
    $var$lines$gen$: [$str$number$gen$, $str$number$gen$];
    $var$type$gen$: $str$'interface' $gen$| $str$'literal' $gen$| $str$'alias' $gen$| $str$'function' $gen$| $str$'enum' $gen$| $str$'union'$gen$;
  }[];
  $var$group$gen$: $str$'different' $gen$| $str$'renamed' $gen$| $str$'identical'$gen$;
  $var$names$gen$: {
    $var$count$gen$: $str$number$gen$;
    $var$name$gen$: $str$string$gen$;
  }[];
  $var$members$kew$?$gen$: $str$string$gen$[];
  $var$parameters$kew$?$gen$: {
    $var$name$gen$: $str$string$gen$;
    $var$type$gen$: $str$string$gen$;
  }[];
  $var$properties$kew$?$gen$: {
    $var$name$gen$: $str$string$gen$;
    $var$type$gen$: $str$string$gen$;
  }[];
  $var$returnType$kew$?$gen$: $str$string$gen$;
  $var$types$kew$?$gen$: $str$string[]$gen$;
}`
          }
        </JsTsCode>
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
