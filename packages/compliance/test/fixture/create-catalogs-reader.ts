// packages\compliance\test\fixture\create-catalogs-reader.ts
import type { DependencyLockfileCatalog } from '@arch-platform/platform-model';

export const catalogsFixture: Readonly<Record<string, DependencyLockfileCatalog>> = {
  default: {
    '@changesets/cli': {
      specifier: '2.31.0',
      version: '2.31.0',
    },
    typescript: {
      specifier: '5.9.3',
      version: '5.9.3',
    },
  },
};

export const catalogsFixtureBuilder: Readonly<Record<string, DependencyLockfileCatalog>> = {
  default: {
    'ts-morph': {
      specifier: 'catalog:',
      version: '25.0.0',
    },
    typescript: {
      specifier: '5.9.3',
      version: '5.9.3',
    },
  },
};
