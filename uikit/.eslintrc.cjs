module.export = {
  extends: [
    '..' // extend the root configuration
  ],
  'plugins': ['react-refresh'],
  'rules': {
    'react-refresh/only-export-components': 'error'
  }
};
