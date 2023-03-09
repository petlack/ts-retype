import './App.styl';
import Code from './components/Code';

export default function App() {
  return (
    <main>
      <header>
        <div className="logo">
          <span>TS</span><span>retype</span>
        </div>
        <div className="links">
          <a href="https://github.com/petlack/ts-retype" target="_blank">See on Github</a>
          <a href="https://www.npmjs.com/package/ts-retype" target="_blank">See on NPM</a>
        </div>
      </header>
      <section>
        <h2>About</h2>
        <p>Discover duplicate TypeScript types in your codebase. </p>
      </section>
      <section>
        <h2>Install</h2>
        <p>Install as a dev dependency</p>
        <Code
          codes={[
            { lang: 'npm', code: 'npm add -D ts-retype' },
            { lang: 'yarn', code: 'yarn add -D ts-retype' },
          ]}
        />
        <p>or install globally</p>
        <Code
          codes={[
            { lang: 'npm', code: 'npm install -g ts-retype' },
            { lang: 'yarn', code: 'yarn add global ts-retype' },
          ]}
        />
      </section>
      <section>
        <h2>Usage</h2>
        <p>To create a report for your project, run</p>
        <Code
          codes={[
            { lang: 'bash', code: 'ts-retype .' },
            { lang: 'npx', code: 'npx ts-retype .' },
          ]}
        />
        <p>Then open the report HTML file (this file is self contained and offline)</p>
        <Code
          code="open retype-report.html"
        />
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
