export function Logo({ name }: { name: string }) {
    const iconStyle = 'bg-accent-500 text-white rounded-md flex items-end justify-end p-1 leading-none';
    const nameStyle = 'text-accent-500 rounded-md flex self-end p-1 leading-none';
    return (
        <div className="flex">
            <div className={iconStyle}>
                <span className="font-black">TS</span>
            </div>
            <div className={nameStyle}>
                <span className="font-bold">{name}</span>
            </div>
        </div>
    );
}
