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
  const dec = useCallback(() => onChange(Math.max(1, value - 1)), [value]);
  return (
    <div className="incdec">
      <button className="minus" onClick={dec}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
        </svg> 
      </button>
      <input type="text" value={value} onChange={(e) => onChange(+e.target.value)} />
      <button className="plus" onClick={inc}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </button>
    </div>
  );
};