import { FC, useState } from 'react';
import { InputNumber } from '@ts-retype/uikit';

export const Inputs: FC<{ className: string }> = ({ className }) => {
    const [value, setValue] = useState(0);
    return <>
        <div className={className}>
            <label htmlFor="input-number">Input number</label>
            <InputNumber
                id="input-number"
                className="bg-default"
                value={value}
                min={0}
                onChange={setValue}
            />
        </div>
    </>;
};
