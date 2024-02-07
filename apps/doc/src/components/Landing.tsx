import * as Snippets from '../generated/snippets';
import { MultilangWindow, TypeScript } from '@ts-retype/uikit/code';
import { Button } from '@ts-retype/uikit';
// import { Button, Heading, IconDocs, IconGithub, MultilangWindow, TsSnippet } from '@ts-retype/uikit';

export function Landing() {
    const theme = 'light';
    return (
        <div className={'landing-container'}>
            <div className="landing">
                <div className="snippets">
                    <TypeScript
                        responsive
                        theme={theme}
                        start={11}
                        snippet={Snippets.Snippet_type}
                        name={'src/model.ts'}
                    />
                    <TypeScript
                        responsive
                        theme={theme}
                        start={41}
                        snippet={Snippets.Snippet_interface}
                        name={'src/auth.ts'}
                    />
                    <TypeScript
                        responsive
                        theme={theme}
                        start={75}
                        snippet={Snippets.Snippet_function}
                        name={'src/api.ts'}
                    />
                </div>
                <div className="description">
                    <h1>Discover duplicate types in TypeScript code</h1>
                    <p>TS retype statically analyzes code and searches for multiple declarations of the same Literal Types, Function Types and Enums/Unions.</p>
                    <p>Run TS retype inside your project folder to get an HTML/JSON report.</p>
                </div>
                <div className="code-install">
                    <MultilangWindow
                        theme={{ dark: 'light', light: 'dark' }[theme] as 'dark' | 'light'}
                        selectedLang="npx"
                        codes={[
                            { code: ['pnpm add -D ts-retype'], lang: 'pnpm' },
                            { code: ['npm add -D ts-retype'], lang: 'npm' },
                            { code: ['yarn add -D ts-retype'], lang: 'yarn' },
                            { code: ['npx ts-retype .'], lang: 'npx' },
                        ]}
                    />
                    <div className="links">
                        <Button
                            // leftIcon={IconDocs}
                            // colorScheme="primary"
                            // size="lg"
                            // kind="link"
                            // href="#docs"
                        >Docs</Button>
                        <Button
                            // leftIcon={IconGithub}
                            // colorScheme="text"
                            // size="lg"
                            // kind="link"
                            // href="https://github.com/petlack/ts-retype"
                        >Source</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
