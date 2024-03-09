import { useEffect, useRef } from 'react';

export type AnyProps = Record<string, any>;

export function useDebugDiff(props: AnyProps, callback: (changedProps: AnyProps) => void) {
  const prevProps = useRef<AnyProps>({});

  useEffect(() => {
    if (prevProps.current) {
      const allKeys = Object.keys({ ...prevProps.current, ...props });
      const changedProps: AnyProps = {};

      allKeys.forEach((key) => {
        if (!Object.is(prevProps.current[key], props[key])) {
          changedProps[key] = {
            from: prevProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        callback(changedProps);
      }
    }

    prevProps.current = props;
  });
}
