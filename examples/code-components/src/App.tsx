import { Code, Lines, Terminal, TypeScript, Window } from '@ts-retype/uikit/code';
import { FC } from 'react';
import { Snippet } from '@ts-retype/search/types';
import { clsx } from '@ts-retype/uikit/clsx';

export const App: FC = () => {
    const cardStyle = clsx(
        'min-w-[400px]',
        'flex justify-center items-center',
        'p-4',
        'border border-1 border-solid border-gray-300',
        'bg-neutral-800',
        'rounded-md',
        'shadow-sm',
        'transition-shadow duration-200 ease-in-out',
        'hover:shadow-md',
    );
    return (
        <div className="clrs-light clrs-core clrs-sx text-default grid grid-cols-2 gap-4 p-4">
            <div className={clsx(cardStyle, 'flex flex-col')}>
                <div className="text-crust-400">
                    <Code>use std::hash::Hash;</Code>
                </div>
                <div className="bg-mantle-400">
                    <Code>[foo for foo in bar if bar is not None]</Code>
                </div>
                <div className="bg-base-400">
                    <Code>const foo = 'bar';</Code>
                </div>
                <div className="bg-white">
                    <Code>ls -ahl | grep -c</Code>
                </div>
            </div>
            <div className={cardStyle}>
                <Window theme="dark" name="001">
                    const foo = 'bar';
                </Window>
            </div>
            <div className={cardStyle}>
                <Window theme="dark">
                    <Code>ts-retype .</Code>
                </Window>
            </div>
            <div className={cardStyle}>
                <Window theme='light' name='100'>
                    <Lines type='lineNo' start={99}>
                        {'ls -ahl'}
                    </Lines>
                    <Lines type='custom' prefix='#'>
                        {'ls -ahl'}
                    </Lines>
                    <Lines>
                        {'ls -ahl'}
                    </Lines>
                </Window>
            </div>
            <div className={cardStyle}>
                <Window theme="light" name='011'>
                    <Lines type='custom' prefix='$'>
                        {[ 'ls -ahl', 'df -h' ]}
                    </Lines>
                </Window>
            </div>
            <div className={cardStyle}>
                <Window theme="light" name="foo">
                    <Terminal theme="light">
                        {'# generate .retyperc in the current directory'}
                        {'ts-retype -i'}
                        {'# run ts-retype using .retyperc in the current directory'}
                        {'ts-retype -c .'}
                    </Terminal>
                </Window>
            </div>


            <div className={cardStyle}>
                <Window theme="light" name='110'>
                    <TypeScript>
                        {{
                            name: 'interface',
                            lang: 'ts',
                            code: {
                                type: 'root',
                                children: [
                                    {type:'text',tagName:'span',properties:{className:['token','comment']},value:'// ...'},
                                    {type:'newline'},
                                    {type:'text',tagName:'span',properties:{className:['token','keyword']},value:'interface'},
                                    {type:'text',value:' '},
                                    {type:'text',tagName:'span',properties:{className:['token','class-name']},value:'IUser'},
                                    {type:'text',value:' '},
                                    {type:'text',tagName:'span',properties:{className:['token','punctuation']},value:'{'},
                                    {type:'newline'},
                                    {type:'text',value:'    displayName'},
                                    {type:'text',tagName:'span',properties:{className:['token','operator']},value:':'},
                                    {type:'text',value:' '},
                                    {type:'text',tagName:'span',properties:{className:['token','builtin']},value:'string'},
                                    {type:'text',tagName:'span',properties:{className:['token','punctuation']},value:';'},
                                    {type:'newline'},
                                    {type:'text',tagName:'span',properties:{className:['token','punctuation']},value:'}'},
                                    {type:'newline'},
                                    {type:'text',tagName:'span',properties:{className:['token','comment']},value:'// ...'}
                                ]
                            },
                        } as Snippet}
                    </TypeScript>
                </Window>
            </div>
        </div>
    );
};
