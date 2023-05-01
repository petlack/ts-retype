import { Logo } from './Logo';
import './TopBar.scss';

export type TopBarProps = {
  children: JSX.Element | JSX.Element[];
}

export function TopBar({ children }: TopBarProps) {
  return (
    <div className="topbar-container">
      <div className="strip"></div>
      <div className="topbar">
        <div className="topbar-header">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}