/* eslint-disable no-console */

export function execute(program: () => Promise<void>) {
    program()
        .then(() => console.log('Done'))
        .catch(err => {
            console.error(err);
            console.error('Error');
        });

}
