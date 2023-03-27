import './UiKitApp.styl';

export type AppProps = {
  children: JSX.Element | JSX.Element[];
  theme: 'dark' | 'light';
}

export function UiKitApp({ children, theme }: AppProps) {
  return (
    <main className={theme}>
      {children}
    </main>
  );
}