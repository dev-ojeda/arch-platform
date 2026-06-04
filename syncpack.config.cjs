/** @type {import('syncpack').RcFile} */
module.exports = {
  formatRepository: true,

  sortExports: true,

  versionGroups: [
    {
      label: 'Use workspace protocol internally',

      dependencies: ['$LOCAL'],

      dependencyTypes: ['prod', 'dev', 'peer', 'optional'],

      pinVersion: 'workspace:*',
    },
  ],

  semverGroups: [
    {
      label: 'Pin internal tooling',

      dependencies: [
        'typescript',
        'vitest',
        'turbo',
        'eslint',
        'prettier',
        'tsup',
        'tsx',
        '@types/node',
        'syncpack',
      ],

      range: '',
    },
  ],

  sortAz: [
    'name',
    'version',
    'private',

    'type',
    'packageManager',

    'files',

    'main',
    'types',
    'exports',

    'scripts',

    'dependencies',
    'devDependencies',
    'peerDependencies',

    'publishConfig',
  ],
};
