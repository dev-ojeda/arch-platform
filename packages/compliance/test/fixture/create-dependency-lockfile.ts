// packages\compliance\test\fixture\create-dependency-lockfile.ts
import type { DependencyLockfile } from '@arch-platform/platform-model';

import { catalogsFixture, catalogsFixtureBuilder } from './create-catalogs-reader.js';
import {
  importerFixtureGovernance,
  importersFixture,
  importersFixtureCodeAnalisys,
} from './create-importers-reader.js';
import { packagesFixture, packagesFixtureCodeAnalisys } from './create-packages-reader.js';
import { snapshotsFixture, snapshotsFixtureCodeAnalisys } from './create-snapshots-reader.js';

export const dependencyLockfileFixture: DependencyLockfile = {
  lockfileVersion: '9.0',
  catalogs: catalogsFixture,
  importers: importersFixture,
  packages: packagesFixture,
  snapshots: snapshotsFixture,
};

export const dependencyLockfileFixtureCodeAnalisys: DependencyLockfile = {
  lockfileVersion: '9.0',
  catalogs: catalogsFixtureBuilder,
  importers: importersFixtureCodeAnalisys,
  packages: packagesFixtureCodeAnalisys,
  snapshots: snapshotsFixtureCodeAnalisys,
};
export const governanceLockfile: DependencyLockfile = {
  ...dependencyLockfileFixtureCodeAnalisys,
  importers: {
    ...dependencyLockfileFixtureCodeAnalisys.importers,
    'packages/governance': importerFixtureGovernance,
  },
};
