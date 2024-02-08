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
            <section className="max-w-full w-full m-0 p-0" id="about">
                <Landing />
            </section>
            <div className="flex flex-col items-center bg-yellow-100 text-default">
                <Docs />
            </div>
            <footer></footer>
        </>
    );
}

export default App;
