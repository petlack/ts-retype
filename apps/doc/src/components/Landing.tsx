import * as Snippets from '../generated/snippets';
import { Highlight, MultilangWindow, Window } from '@ts-retype/uikit/code';
import { IconDocs, IconGithub } from '@ts-retype/uikit/icons';
import { Button } from '@ts-retype/uikit';

export function Landing() {
    const ctaStyle = 'bg-accent-500 text-white hover:bg-accent-600';
    return (
        <div className="flex flex-col align-center bg-landing p-12 border-b border-border">
            <div className="flex flex-col">
                <div className="flex flex-row gap-4 items-center justify-between">
                    <Window name="src/model.ts">
                        <Highlight start={11}>
                            {Snippets.Snippet_type}
                        </Highlight>
                    </Window>
                    <Window name="src/auth.ts">
                        <Highlight start={41}>
                            {Snippets.Snippet_interface}
                        </Highlight>
                    </Window>
                    <Window name="src/api.ts">
                        <Highlight start={75}>
                            {Snippets.Snippet_function}
                        </Highlight>
                    </Window>
                </div>
                <div className="flex flex-col justify-self-center justify-start">
                    <h1 className="max-w-xl w-[50ch] text-4xl mb-4 text-neutral-950">Discover duplicate types in Highlight code</h1>
                    <p>TS retype statically analyzes code and searches for multiple declarations of the same Literal Types, Function Types and Enums/Unions.</p>
                    <p>Run TS retype inside your project folder to get an HTML/JSON report.</p>
                </div>
                <div className="flex flex-col gap-2 justify-self-end">
                    <MultilangWindow
                        selectedLang="npx"
                        codes={[
                            { code: ['pnpm add -D ts-retype'], lang: 'pnpm' },
                            { code: ['npm add -D ts-retype'], lang: 'npm' },
                            { code: ['yarn add -D ts-retype'], lang: 'yarn' },
                            { code: ['npx ts-retype .'], lang: 'npx' },
                        ]}
                    />
                    <div className="flex flex-row gap-2">
                        <Button href="#docs" className={ctaStyle}>
                            <IconDocs /> Docs
                        </Button>
                        <Button href="https://github.com/petlack/ts-retype" className={ctaStyle}>
                            <IconGithub /> Source
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
