type ClsxArg = string |
    number |
    Record<string, boolean | number | null | undefined> |
    ClsxArg[] |
    undefined |
    null;

function toVal(mix: ClsxArg): string | null {
    if (!mix) return null;

    switch (typeof mix) {
    case 'string':
        return mix;
    case 'number':
        return mix.toString();
    case 'object':
        if (Array.isArray(mix)) {
            return mix.map(toVal)
                .filter(x => x)
                .join(' ');
        } else {
            return Object.keys(mix)
                .filter(k => mix[k])
                .join(' ');
        }
    }
}

export function clsx(...args: ClsxArg[]): string  {
    return args.map(toVal)
        .filter(x => x)
        .join(' ');
}
