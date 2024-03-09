/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: ['@ts-retype/uikit', '@ts-retype/docs'],
  appDirectory: 'app',
  assetsBuildDirectory: 'public/dist',
  serverBuildPath: 'dist/index.js',
  publicPath: '/ts-retype/dist/',
};
