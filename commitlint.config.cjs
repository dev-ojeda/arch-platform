// commitlint.config.cjs

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    /*
     * type(scope): subject
     */

    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'perf',
        'test',
        'docs',
        'build',
        'ci',
        'chore',
        'style',
        'revert',
      ],
    ],

    'scope-enum': [
      2,
      'always',
      [
        'application',
        'contracts',
        'core',
        'cli',
        'generators',
        'governance',
        'infrastructure',
        'platform-model',
        'scripts',
        'shared',
        'testing',
        'workspace',
        'monorepo',
        'tooling',
        'docs',
        'domain-order',

        'application/engine',
        'application/runtime',
        'application/pipeline',
        'application/testing',

        'contracts/generation',
        'contracts/runtime',

        'core/cancellation',
        'core/errors',
        'core/runtime',

        'testing/unit',
        'testing/integration',
        'testing/runtime',

        'infrastructure/logging',
        'infrastructure/persistence',
      ],
    ],

    'scope-case': [2, 'always', 'kebab-case'],

    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],

    'subject-empty': [2, 'never'],

    'type-empty': [2, 'never'],

    'header-max-length': [2, 'always', 100],
  },
};
