import { Docs } from './components/Docs.js';
import { Landing } from './components/Landing.js';
import { Menu } from './components/Menu.js';
import { Topbar } from '@ts-retype/uikit';

function App() {
    return (
        <>
            <Topbar>
                <Menu />
                <></>
            </Topbar>
            <section className="bleed" id="about">
                <Landing />
            </section>
            <div className="flex flex-col align-center bg-mantle text-default">
                <Docs />
            </div>
            <footer></footer>
        </>
    );
}

export default App;
