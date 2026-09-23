// packages\infrastructure\test\__tests__\yaml\pnpm-lock-file-reader.test.ts

import { describe, expect, it } from 'vitest';

import { DependencyLockfileProvider } from '@arch-platform/infrastructure';

import { FIXTURE_PATHS } from '../../fixture/fixture-paths.js';

describe('DependencyLockfileProvider', () => {
  const readerFactory = new DependencyLockfileProvider();

  it('reads the pnpm lockfile fixture', async () => {
    const reader = readerFactory.createReader(FIXTURE_PATHS.archWorkspace);
    const lockfile = await reader.read(FIXTURE_PATHS.archWorkspace, FIXTURE_PATHS.lockfile);

    expect(lockfile.lockfileVersion).toBeDefined();
    expect(lockfile.importers).toBeDefined();
    expect(lockfile.packages).toBeDefined();
  });

  it('reads workspace importer dependency information', async () => {
    const reader = readerFactory.createReader(FIXTURE_PATHS.archWorkspace);
    const lockfile = await reader.read(FIXTURE_PATHS.archWorkspace, FIXTURE_PATHS.lockfile);

    const testing = lockfile.importers['packages/testing'];

    expect(testing).toBeDefined();
    expect(testing.dependencies?.['@arch-platform/core']).toBeDefined();
    expect(testing.dependencies?.['@arch-platform/core']?.specifier).toBe('workspace:*');
  });

  it('returns a package with peerDependencies context', async () => {
    const reader = readerFactory.createReader(FIXTURE_PATHS.archWorkspace);
    const lockfile = await reader.read(FIXTURE_PATHS.archWorkspace, FIXTURE_PATHS.lockfile);

    const pkg = lockfile.packages['typescript-eslint@8.59.4'];

    expect(pkg?.peerDependencies).toEqual({
      eslint: '^8.57.0 || ^9.0.0 || ^10.0.0',
      typescript: '>=4.8.4 <6.1.0',
    });
  });

  it('returns a dependency from a catalog', async () => {
    const reader = readerFactory.createReader(FIXTURE_PATHS.archWorkspace);
    const lockfile = await reader.read(FIXTURE_PATHS.archWorkspace, FIXTURE_PATHS.lockfile);

    const catalogs = lockfile.catalogs['default']?.['@changesets/cli'];

    expect(catalogs.specifier).toBe('2.31.0');
    expect(catalogs.version).toBe('2.31.0');
  });

  it('reads package snapshots', async () => {
    const reader = readerFactory.createReader(FIXTURE_PATHS.archWorkspace);
    const lockfile = await reader.read(FIXTURE_PATHS.archWorkspace, FIXTURE_PATHS.lockfile);

    const snapshot = lockfile.snapshots['@arch-platform/generator-mvc@0.1.0'];

    expect(snapshot).toBeDefined();
    expect(snapshot?.dependencies?.['@arch-platform/contracts']).toBe('0.1.0');
  });

  it('reads an empty package snapshot', async () => {
    const reader = readerFactory.createReader(FIXTURE_PATHS.archWorkspace);
    const lockfile = await reader.read(FIXTURE_PATHS.archWorkspace, FIXTURE_PATHS.lockfile);

    const snapshot = lockfile.snapshots['@arch-platform/contracts@0.1.0'];

    expect(snapshot).toBeDefined();
    expect(snapshot?.dependencies).toBeUndefined();
  });
});
