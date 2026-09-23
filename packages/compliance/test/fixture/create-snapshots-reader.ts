import type { DependencyLockfileSnapshot } from '@arch-platform/platform-model';

export const snapshotsFixture: Readonly<Record<string, DependencyLockfileSnapshot>> = {
  '@arch-platform/contracts@0.1.0': {},
  '@arch-platform/generator-mvc@0.1.0': {
    dependencies: {
      '@arch-platform/contracts': '0.1.0',
    },
  },
};

export const snapshotsFixtureCodeAnalisys: Readonly<Record<string, DependencyLockfileSnapshot>> = {
  'ts-morph@25.0.0': {
    dependencies: {
      '@ts-morph/common': '0.26.1',
    },
  },
  '@ts-morph/common@0.26.1': {
    dependencies: {
      minimatch: '9.0.9',
    },
  },
  'minimatch@9.0.9': {
    dependencies: {
      'brace-expansion': '2.1.1',
    },
  },
  'brace-expansion@2.1.1': {},
  'typescript@5.9.3': {},
};
