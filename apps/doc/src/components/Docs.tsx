import * as Snippets from '../generated/snippets';
import {
    Code,
    MultilangWindow,
    Terminal,
    Highlight,
    Window,
} from '@ts-retype/uikit/code';
import { FC, PropsWithChildren } from 'react';
import { Options } from './Options';
import { TS_RETYPE_CMD_OPTIONS } from '@ts-retype/search/types';

export function Docs() {
    return (
        <div className={'py-12'}>
            <Section id="install">
                <Heading>Install</Heading>
                <p>Install as a dev dependency</p>
                <MultilangWindow
                    codes={[
                        { lang: 'pnpm', code: ['pnpm add -D ts-retype'] },
                        { lang: 'npm', code: ['npm add -D ts-retype'] },
                        { lang: 'yarn', code: ['yarn add -D ts-retype'] },
                    ]} />
                <p>or install globally</p>
                <MultilangWindow
                    codes={[
                        { lang: 'pnpm', code: ['pnpm install -g ts-retype'] },
                        { lang: 'npm', code: ['npm install -g ts-retype'] },
                        { lang: 'yarn', code: ['yarn add global ts-retype'] },
                    ]} />
            </Section>

            <Section id="usage">
                <Heading>Usage</Heading>
                <p>To create a report for your project, run</p>
                <MultilangWindow
                    selectedLang="npx"
                    codes={[
                        { lang: 'bash', code: ['ts-retype .'] },
                        { lang: 'npx', code: ['npx ts-retype .'] },
                    ]} />
                <p>Then open the report HTML file (this file is self contained and offline)</p>
                <Window>
                    <Terminal>
                        {'open retype-report.html'}
                    </Terminal>
                </Window>
            </Section>

            <Section id="docs">
                <Heading>CLI</Heading>
                <p>Configuration can be done by either CLI options</p>
                <Window>
                    <Code>
                        {'ts-retype [options] <path-to-project>'}
                    </Code>
                </Window>
                <Options>
                    {TS_RETYPE_CMD_OPTIONS}
                </Options>
                <p>Or by using the <strong>--config</strong> option and providing path to config .retyperc</p>
                <Window>
                    <Terminal>
                        {[
                            '# generate .retyperc in the current directory',
                            'ts-retype -i',
                            '# run ts-retype using .retyperc in the current directory',
                            'ts-retype -c .',
                        ]}
                    </Terminal>
                </Window>
                <p>An example of a <strong>.retyperc</strong> file</p>
                <Window>
                    <Highlight noLines>
                        {Snippets.Snippet_retyperc}
                    </Highlight>
                </Window>
            </Section>

            <Section>
                <Heading>ts-retype</Heading>
                <p>You can also run it programatically, using ts-retype package.</p>
                <Window>
                    <Highlight noLines>
                        {Snippets.Snippet_tsRetype}
                    </Highlight>
                </Window>
                <p>The input for <strong>scan</strong> is of type <strong>ScanProps</strong></p>
                <Window>
                    <Highlight noLines>
                        {Snippets.Snippet_ScanProps}
                    </Highlight>
                </Window>
                <p>An example for the snippets in the landing page would look like this</p>
                <Window>
                    <Highlight noLines>
                        {Snippets.Snippet_duplicate}
                    </Highlight>
                </Window>
                <p>The return type of <strong>scan</strong> is an array of <strong>TypeDuplicate</strong></p>
                <Window>
                    <Highlight noLines>
                        {Snippets.Snippet_TypeDuplicate}
                    </Highlight>
                </Window>
            </Section>

            <Section id="examples">
                <Heading>Examples</Heading>
                <p>Example reports for following projects</p>
                <ul>
                    <li><a href="./report-ts-retype.html" target="_blank">petlack/ts-retype</a></li>
                    <li><a href="./report-apollo-client.html" target="_blank">apollographql/apollo-client</a></li>
                    <li><a href="./report-apollo-server.html" target="_blank">apollographql/apollo-server</a></li>
                </ul>
            </Section>
        </div>
    );
}

const Section: FC<PropsWithChildren<{ id?: string }>> = ({ children, id }) => (
    <section id={id} className="flex flex-col min-w-[20ch] max-w-[100ch] w-[80vw] text-md px-12 py-8 gap-8">
        {children}
    </section>
);

const Heading: FC<PropsWithChildren> = ({ children }) => <h2 className="text-2xl font-bold">{children}</h2>;
