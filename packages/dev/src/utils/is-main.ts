/**
* Returns true if the current process is the main process.
**/
export function isMain(): boolean {
    return require.main === module;
}
