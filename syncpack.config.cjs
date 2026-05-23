/** @type {import("syncpack").RcFile} */
module.exports = {
  formatRepository: true,
  sortExports: true,
  versionGroups: [
    {
      label: 'Use workspace protocol internally',
      dependencies: ['$LOCAL'],
      dependencyTypes: ['prod', 'dev', 'peer'],
      pinVersion: 'workspace:*',
    },
  ],

  semverGroups: [
    {
      label: 'Pin internal tooling',
      dependencies: ['typescript', 'vitest', 'turbo', 'eslint', 'prettier', 'tsup'],
      range: '',
    },
  ],

  sortAz: [
    'name',
    'version',
    'private',
    'type',
    'packageManager',
    'scripts',
    'exports',
    'dependencies',
    'devDependencies',
    'peerDependencies',
  ],
};
