import { useCallback } from 'react';
import './IncDecInput.scss';

export type IncDecInputArgs = {
  value: number;
  onChange: (val: number) => void;
}

export function IncDecInput({
  value,
  onChange,
}: IncDecInputArgs) {
  const inc = useCallback(() => onChange(value + 1), [value]);
  const dec = useCallback(() => onChange(value - 1), [value]);
  return (
    <div className="incdec">
      <button onClick={dec}>-</button>
      <input type="text" value={value} onChange={(e) => onChange(+e.target.value)} />
      <button onClick={inc}>+</button>
    </div>
  );
};