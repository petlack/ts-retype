import * as Snippets from '../generated/snippets';
import { Highlight, MultilangWindow, Window } from '@ts-retype/uikit/code';
import { IconDocs, IconGithub } from '@ts-retype/uikit/icons';
import { Button } from '@ts-retype/uikit';
import { clsx } from '@ts-retype/uikit/clsx';

export function Landing() {
    const ctaStyle = 'font-bold';
    return (
        <div className="grid bg-landing p-12 justify-center">
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
                <div className={clsx(
                    'flex flex-col',
                    'justify-self-center justify-start',
                )}>
                    <h1 className={clsx(
                        'max-w-xl w-[50ch]',
                        'mb-6',
                        'text-5xl leading-tight',
                        'text-neutral-950',
                    )}>
                        Discover duplicate types in <strong>TypeScript</strong> codebases
                    </h1>
                    <p className="w-[50ch] leading-7 text-lg mb-2">
                        TS retype <strong>statically analyzes code</strong> and
                        searches for <strong>multiple declarations</strong> of the
                        same Literal Types, Function Types and Enums/Unions.
                    </p>
                    <p className="w-[50ch] leading-7 text-lg">
                        Run TS retype inside your project folder to get
                        an <strong>HTML</strong>/<strong>JSON</strong> report.
                    </p>
                </div>
                <div className="flex flex-col gap-2 justify-center items-center">
                    <div className="flex flex-col gap-2">
                        <p className="text-neutral-300 text-lg mb-2 pl-4">
                            Try it yourself
                        </p>
                        <MultilangWindow
                            className="w-[28ch]"
                            selectedLang="npx"
                            codes={[
                                { code: ['pnpx ts-retype .'], lang: 'pnpx' },
                                { code: ['npx ts-retype .'], lang: 'npx' },
                                { code: ['yarn dlx ts-retype .'], lang: 'yarn' },
                            ]}
                        />
                        <p className="text-neutral-300 text-lg mt-4 mb-4 pl-4">
                            Or read the docs
                        </p>
                        <div className="grid grid-cols-2 gap-2 justify-self-center">
                            <Button
                                href="#docs"
                                className={clsx(
                                    ctaStyle,
                                    'bg-accent-500 text-white hover:bg-accent-600',
                                )}>
                                <IconDocs /> Docs
                            </Button>
                            <Button
                                href="https://github.com/petlack/ts-retype"
                                className={clsx(
                                    ctaStyle,
                                    'bg-neutral-700 text-white hover:bg-neutral-500',
                                )}>
                                <IconGithub /> Source
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <InstallHref />
        </div>
    );
}

const InstallHref = () => (
    <a href="#install" className={clsx(
        'absolute',
        'bottom-0 left-[50vw] z-10',
        'w-96',
        '-translate-x-1/2',
        'flex flex-col items-center',
        'pb-10 gap-4',
        'opacity-0',
        'hover:opacity-100',
        'transition duration-300 ease-in-out',
    )}>
        <h2 className={clsx(
            'text-2xl text-default',
        )}>Install</h2>
        <span className={clsx(
            'w-10 h-10',
            'rotate-45 origin-center',
            'border-r-[12px] border-b-[12px] border-neutral-200',
            'opacity-50',
            'hover:opacity-100',
            'cursor-pointer',
            'transition duration-200 ease-in-out',
        )} />
    </a>
);
