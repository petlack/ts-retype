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
          <a href="/a">See on Github</a>
          <a href="/a">See on NPM</a>
        </div>
      </header>
      <section>
        <h2>About</h2>
        <p>Lorem ipsum dolor sit amet</p>
      </section>
      <section>
        <h2>Install</h2>
        <Code
          code="npm add -D ts-retype"
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
        <h2>Examples</h2>
        <p>See example reports for following projects</p>
        <ul>
          <li><a href="./example-ts-retype.html">github.com/petlack/ts-retype</a></li>
          <li><a href="./example-apollo-client.html">github.com/apollographql/apollo-client</a></li>
          <li><a href="./example-apollo-server.html">github.com/apollographql/apollo-server</a></li>
        </ul>
      </section>
      <footer>

      </footer>
    </main>
  );
}
