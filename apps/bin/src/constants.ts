/**
* HTML content of a report template
*/
export const HTML_TEMPLATE = 'TS_RETYPE_REPORT_HTML_TEMPLATE';

/**
* The project info (package.json)
*/
export const PROJECT_INFO = {
    name: 'TS_RETYPE_PROJECT_NAME',
    description: 'TS_RETYPE_PROJECT_DESCRIPTION',
    version: 'TS_RETYPE_PROJECT_VERSION',
    docs: 'TS_RETYPE_PROJECT_DOCS',
    repo: 'TS_RETYPE_PROJECT_REPO',
};

export function hasConstants(): boolean {
    return (
        !HTML_TEMPLATE.toString().slice(0).startsWith('TS_RETYPE_') &&
        !PROJECT_INFO.name.slice(0).startsWith('TS_RETYPE_')
    );
}
