import * as Snippets from '../generated/snippets';
import { MultilangWindow, TypeScript } from '@ts-retype/uikit/code';
import { Button } from '@ts-retype/uikit';
import { IconDocs, IconGithub } from '@ts-retype/uikit/icons';

export function Landing() {
    const theme = 'light';
    return (
        <div className="landing-container flex flex-col align-center bg-landing p-12 border-b border-border">
            <div className="landing flex flex-col">
                <div className="flex flex-row gap-4 items-center justify-between">
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
                <div className="description flex flex-col justify-self-center justify-start">
                    <h1 className="max-w-xl w-[50ch] text-4xl mb-4 text-neutral-950">Discover duplicate types in TypeScript code</h1>
                    <p>TS retype statically analyzes code and searches for multiple declarations of the same Literal Types, Function Types and Enums/Unions.</p>
                    <p>Run TS retype inside your project folder to get an HTML/JSON report.</p>
                </div>
                <div className="code-install flex flex-col gap-2 justify-self-end">
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
                    <div className="links flex flex-row gap-2">
                        <Button
                            href="#docs"
                        >{IconDocs} Docs</Button>
                        <Button
                            href="https://github.com/petlack/ts-retype"
                        >{IconGithub} Source</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
