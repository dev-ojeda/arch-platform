// packages\compliance\test\fixture\create-importers-reader.ts
import type { DependencyLockfileImporter } from '@arch-platform/platform-model';

export const importerFixture: DependencyLockfileImporter = {
  dependencies: {
    '@arch-platform/contracts': {
      specifier: '0.1.0',
      version: '0.1.0',
    },
    '@arch-platform/core': {
      specifier: 'workspace:*',
      version: 'link:../core',
    },
  },
  devDependencies: {
    typescript: {
      specifier: 'catalog:',
      version: '5.9.3',
    },
  },
};

export const importerFixtureCodeAnalisys: DependencyLockfileImporter = {
  dependencies: {
    'ts-morph': { specifier: 'catalog:', version: '25.0.0' },
    typescript: { specifier: 'catalog:', version: '5.9.3' },
  },
};

export const importersFixture: Readonly<Record<string, DependencyLockfileImporter>> = {
  'packages/application': importerFixture,
};

export const importersFixtureCodeAnalisys: Readonly<Record<string, DependencyLockfileImporter>> = {
  'packages/code-analysis': importerFixtureCodeAnalisys,
};
export const importerFixtureGovernance: DependencyLockfileImporter = {
  dependencies: {
    '@arch-platform/code-analysis': {
      specifier: 'workspace:*',
      version: 'link:../code-analysis',
    },
  },
};
