export type WindowProps = {
    children: JSX.Element | JSX.Element[];
    header?: JSX.Element | JSX.Element[];
    showHeader?: boolean;
    responsive?: boolean;
    theme: 'dark' | 'light';
    name: string;
}

export function Window({ name, theme, showHeader = true, header, children, responsive = false }: WindowProps) {
    const headerMarkup = (
        <div className="header">
            <div className="icons">
                <span className="icon red"></span>
                <span className="icon yellow"></span>
                <span className="icon green"></span>
            </div>
            <div className="name">{name}</div>
        </div>
    );
    return (
        <div className={`window ${theme} ${responsive ? 'window-responsive' : ''}`}>
            {showHeader ? headerMarkup : <></>}
            {header ? header : <></>}
            <div className="content">
                {children}
            </div>
        </div>
    );
}
