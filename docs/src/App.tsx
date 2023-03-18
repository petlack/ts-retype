import { Landing } from './components/Landing';
import { MultilangWindow } from './components/MultilangWindow';
import { Code, Window } from './components/Window';
import './App.styl';
import { Options } from './components/Options';
import { Bash } from './components/Bash';
import { JsTsCode } from './components/JsTsCode';

const theme = 'light';
// const theme = 'dark';
// const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export default function App() {
  return (
    <main className={theme}>
      <section className="bleed">
        <Landing theme={theme} />
      </section>
      <section>
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
      <section>
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

      <section>
        <h2>CLI</h2>
        <p>CLI options are as following</p>
        <p>Configuration can be done by either CLI options</p>
        <div className="bash">
          <Window theme={theme} name="bash" showHeader={false}>
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
        <Bash theme={theme}>
          {
            `# generate .retyperc in the current directory
ts-retype -g
# run ts-retype using .retyperc in the current directory
ts-retype -c .`
          }
        </Bash>
        <p>An example of a <strong>.retyperc</strong> file</p>
        <JsTsCode theme={theme}>
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
        <JsTsCode theme={theme}>
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
        <JsTsCode theme={theme}>
          {`$kew$type $fun$RetypeArgs$gen$ = $bra$\{
  $jkw$exclude$gen$: $str$string$bra$[]$gen$;
  $jkw$include$gen$: $str$string$bra$[]$gen$;
  $jkw$output$gen$: $str$string$gen$;
  $jkw$project$gen$: $str$string$gen$;
  $jkw$json$gen$?: $str$string$gen$;
  $jkw$noHtml$gen$?: $str$boolean$gen$;
}`}
        </JsTsCode>
        <p>An example for the snippets in the landing page would look like this</p>
        <JsTsCode theme={theme}>
          {
            `$kew$const $var$duplicate$gen$: $fun$TypeDuplicate $gen$= $bra$\{
  $jkw$files$gen$: $bra$[
    $bra$\{ $jkw$file$gen$: $str$'src/model.ts'$gen$, $jkw$lines$gen$: [$str$12$pun$, $str$16$gen$], $jkw$type$gen$: $str$'alias'$gen$ $bra$}$pun$,
    $bra$\{ $jkw$file$gen$: $str$'src/auth.ts'$gen$, $jkw$lines$gen$: [$str$42$pun$, $str$46$gen$], $jkw$type$gen$: $str$'interface'$gen$ $bra$}$pun$,
    $bra$\{ $jkw$file$gen$: $str$'src/api.ts'$gen$, $jkw$lines$gen$: [$str$76$pun$, $str$83$gen$], $jkw$type$gen$: $str$'literal'$gen$ $bra$}$pun$,
  $bra$]$pun$,
  $jkw$group$gen$: $str$'renamed'$gen$,
  $jkw$names$gen$: $bra$[
    $bra$\{ $jkw$name$gen$: $str$'IUser'$gen$, $jkw$count$gen$: $str$1$gen$ $bra$}$pun$,
    $bra$\{ $jkw$name$gen$: $str$'User'$gen$, $jkw$count$gen$: $str$1$gen$ $bra$}$pun$,
    $bra$\{ $jkw$name$gen$: $str$'anonymous'$gen$, $jkw$count$gen$: $str$1$gen$ $bra$}$pun$,
  $bra$]$pun$,
  $jkw$properties$gen$: $bra$[
    $bra$\{ $jkw$name$gen$: $str$'displayName'$gen$, $jkw$type$gen$: $str$'string'$gen$ $bra$}$pun$,
    $bra$\{ $jkw$name$gen$: $str$'email'$gen$, $jkw$type$gen$: $str$'string'$gen$ $bra$}$pun$,
    $bra$\{ $jkw$name$gen$: $str$'password'$gen$, $jkw$type$gen$: $str$'string'$gen$ $bra$}$pun$,
  $bra$]
}`
          }
        </JsTsCode>
        <p>The return type of <strong>findDuplicateTypes</strong> is an array of <strong>TypeDuplicate</strong></p>
        <JsTsCode theme={theme}>
          {
            `$kew$type $fun$TypeDuplicate $gen$= $bra$\{
  $jkw$files$gen$: $bra$\{
    $jkw$file$gen$: $str$string$gen$;
    $jkw$lines$gen$: $bra$[$str$number$gen$, $str$number$bra$]$gen$;
    $jkw$type$gen$: $str$'interface' $kew$| $str$'literal' $kew$| $str$'alias' $kew$| $str$'function' $kew$| $str$'enum' $kew$| $str$'union'$gen$;
  $bra$}[];
  $jkw$group$gen$: $str$'different' $kew$| $str$'renamed' $kew$| $str$'identical'$gen$;
  $jkw$names$gen$: $bra$\{
    $jkw$count$gen$: $str$number$gen$;
    $jkw$name$gen$: $str$string$gen$;
  $bra$}[];
  $jkw$members$kew$?$gen$: $str$string$gen$$bra$[]$gen$;
  $jkw$parameters$kew$?$gen$: $bra$\{
    $jkw$name$gen$: $str$string$gen$;
    $jkw$type$gen$: $str$string$gen$;
  $bra$}[];
  $jkw$properties$kew$?$gen$: $bra$\{
    $jkw$name$gen$: $str$string$gen$;
    $jkw$type$gen$: $str$string$gen$;
  $bra$}[];
  $jkw$returnType$kew$?$gen$: $str$string$gen$;
  $jkw$types$kew$?$gen$: $str$string$bra$[]$gen$;
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
