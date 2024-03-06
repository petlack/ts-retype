import * as Snippets from '../generated/snippets';
import { Highlight, MultilangWindow, Window } from '@ts-retype/uikit/code';
import { IconDocs, IconGithub } from '@ts-retype/uikit/icons';
import { Button } from '@ts-retype/uikit';
import { clsx } from '@ts-retype/uikit/clsx';

export function Landing() {
    const ctaStyle = 'font-bold';
    return (
        <div className="grid bg-landing p-12 border-b border-border justify-center">
            <div className="grid grid-cols-min-1fr gap-8 max-w-5xl">
                <div className="col-span-2 flex flex-row gap-4 items-center justify-self-center">
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
                    <h1 className="max-w-xl w-[50ch] text-5xl mb-4 text-neutral-950 leading-tight">Discover duplicate types in TypeScript codebases</h1>
                    <p className="w-[50ch] leading-relaxed mb-2">TS retype statically analyzes code and searches for multiple declarations of the same Literal Types, Function Types and Enums/Unions.</p>
                    <p className="w-[50ch] leading-relaxed">Run TS retype inside your project folder to get an HTML/JSON report.</p>
                </div>
                <div className="flex flex-col gap-2 justify-self-end items-end">
                    <MultilangWindow
                        selectedLang="npx"
                        codes={[
                            { code: ['pnpm add -D ts-retype'], lang: 'pnpm' },
                            { code: ['npm add -D ts-retype'], lang: 'npm' },
                            { code: ['yarn add -D ts-retype'], lang: 'yarn' },
                            { code: ['npx ts-retype .'], lang: 'npx' },
                        ]}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <Button href="#docs" className={clsx(
                            ctaStyle,
                            'bg-accent-500 text-white hover:bg-accent-600',
                        )}>
                            <IconDocs /> Docs
                        </Button>
                        <Button href="https://github.com/petlack/ts-retype" className={clsx(
                            ctaStyle,
                            'bg-neutral-700 text-white hover:bg-neutral-500',
                        )}>
                            <IconGithub /> Source
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
