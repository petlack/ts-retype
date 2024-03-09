export const ONE_SECOND = 1_000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;

/**
* Format a duration in milliseconds to a human-readable string.
* @param ms - The duration in milliseconds.
* @param format - The format to use.
*   - `'digital'`: Format the duration as a digital clock. (1:45.12)
*   - `'text'`: Format the duration as a human-readable string. (1m 45s)
*  @returns The formatted duration.
*/
export function formatDuration(
    ms: number,
    format: 'digital' | 'text' = 'text',
) {
    let sec = ms / 1000;
    if (sec < 60) {
        switch (format) {
        case 'digital':
            return sec.toFixed(3);
        case 'text':
            return `${sec.toFixed(3)}s`;
        }
    }
    let min = Math.floor(sec / 60);
    sec -= min * 60;
    if (min < 60) {
        switch (format) {
        case 'digital':
            return `${pad(min)}:${sec.toFixed(3).padStart(6, '0')}`;
        case 'text':
            return `${min}m ${sec.toFixed(1)}s`;
        }
    }
    const hours = Math.floor(min / 60);
    min -= hours * 60;
    switch (format) {
    case 'digital':
        return `${pad(hours)}:${pad(min)}:${sec.toFixed(3).padStart(6, '0')}`;
    case 'text':
        return `${hours}h ${min}m ${Math.round(sec)}s`;
    }
}

const pad = (n: number) => n.toString().padStart(2, '0');
