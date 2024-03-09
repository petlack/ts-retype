import { panic } from './colors.js';

/**
* Executes the Promise and logs the result.
*/
export function execute(program: () => Promise<void>) {
    /* eslint-disable no-console */
    program()
        .then(() => console.log('Done'))
        .catch(err => {
            console.error(err);
            panic('Error');
        });
    /* eslint-enable no-console */
}
