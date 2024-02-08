import { Docs } from './components/Docs.js';
import { Landing } from './components/Landing.js';
import { Logo, Topbar } from '@ts-retype/uikit';
import { clsx } from '@ts-retype/uikit/clsx';
import { Foo } from './components/Foo.js';

function App() {
    const appStyle = clsx(
        'clrs-light clrs-core clrs-sx clrs-docs',
        'flex flex-col items-center',
        'text-default',
    );
    return (
        <div className={appStyle}>
            <Foo />
            <Topbar className="bg-topbar w-full">
                <Logo name="retype" />
                <Menu />
            </Topbar>
            <section id="about" className="max-w-full w-full m-0 p-0 bg-landing">
                <Landing />
            </section>
            <div className="flex max-w-full w-full flex-col items-center bg-mantle-50 text-default">
                <Docs />
            </div>
            <footer></footer>
        </div>
    );
}

function Menu() {
    const menuItemStyle = clsx(
        'text-default',
        'pointer',
        'px-1 py-2',
        'hover:text-accent-500',
        'transition-colors duration-200 ease-in-out'
    );
    return (
        <div className="flex flex-row sticky gap-6 px-12 justify-end">
            <a className={clsx(menuItemStyle, 'text-accent-400')} href="#about">About</a>
            <a className={menuItemStyle} href="#install">Install</a>
            <a className={menuItemStyle} href="#usage">Usage</a>
            <a className={menuItemStyle} href="#examples">Examples</a>
        </div>
    );
}

export default App;
