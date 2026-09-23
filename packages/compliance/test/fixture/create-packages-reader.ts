// packages\compliance\test\fixture\create-packages-reader.ts
import type { DependencyLockfilePackage } from '@arch-platform/platform-model';

export const packagesFixture: Readonly<Record<string, DependencyLockfilePackage>> = {
  '@arch-platform/contracts@0.1.0': {
    resolution: {
      integrity: 'sha512-test-contracts',
    },
    dependencies: {},
  },

  'typescript@5.9.3': {
    resolution: {
      integrity: 'sha512-test-typescript',
    },
    dependencies: {},
  },

  'ts-morph@25.0.0': {
    resolution: {
      integrity: 'sha512-test-ts-morph',
    },
    dependencies: {
      '@ts-morph/common': '0.26.1',
    },
  },
  'eslint@9.39.4(jiti@2.6.1)': {
    resolution: {
      integrity: 'sha512-test-eslint',
    },
    dependencies: {
      '@eslint-community/eslint-utils': '4.9.1(eslint@9.39.4(jiti@2.6.1))',
    },
  },
  '@babel/code-frame@7.29.7': {
    resolution: {
      integrity: 'sha512-test-babel',
    },
    engines: {
      node: '>=6.9.0',
    },
  },
  '@commitlint/cli@21.0.1': {
    resolution: {
      integrity: 'sha512-test-commitlint',
    },
    hasBin: true,
  },
  'typescript-eslint@8.59.4': {
    resolution: {
      integrity: 'sha512-test-typescript',
    },
    peerDependencies: {
      eslint: '^8.57.0 || ^9.0.0 || ^10.0.0',
      typescript: '>=4.8.4 <6.1.0',
    },
  },
  'brace-expansion@1.1.15': {
    resolution: {
      integrity: 'sha512-test-brace-expansion',
    },
  },
  'brace-expansion@2.1.1': {
    resolution: {
      integrity: 'sha512-test-brace-expansion',
    },
  },
  'brace-expansion@5.0.6': {
    resolution: {
      integrity: 'sha512-test-brace-expansion',
    },
    engines: { node: '18 || 20 || >=22' },
  },
};

export const packagesFixtureCodeAnalisys: Readonly<Record<string, DependencyLockfilePackage>> = {
  'typescript@5.9.3': {
    resolution: {
      integrity: 'sha512-test-typescript',
    },
    dependencies: {},
  },

  'ts-morph@25.0.0': {
    resolution: {
      integrity: 'sha512-test-ts-morph',
    },
    dependencies: {
      '@ts-morph/common': '0.26.1',
    },
  },

  '@ts-morph/common@0.26.1': {
    resolution: {
      integrity: 'sha512-test-ts-morph-common',
    },
    dependencies: {
      minimatch: '9.0.9',
    },
  },

  'minimatch@9.0.9': {
    resolution: {
      integrity: 'sha512-test-minimatch',
    },
    dependencies: {
      'brace-expansion': '2.1.1',
    },
  },

  'brace-expansion@2.1.1': {
    resolution: {
      integrity: 'sha512-test-brace-expansion',
    },
    dependencies: {},
  },
};
