import { describe, expect, it } from 'vitest';

import { DependencyLockfileQuery } from '@arch-platform/compliance';

import { dependencyLockfileFixture } from '../fixture/create-dependency-lockfile.js';

describe('DependencyLockfileQuery', () => {
  const query = new DependencyLockfileQuery(dependencyLockfileFixture);

  it('returns a dependency from a catalog', () => {
    const dependency = query.getCatalogDependency('default', '@changesets/cli');
    expect(dependency?.specifier).toBe('2.31.0');
    expect(dependency.version).toBe('2.31.0');
  });

  it('returns an importer by workspace path', () => {
    const importer = query.getImporter('packages/application');

    expect(importer?.dependencies?.['@arch-platform/contracts']).toEqual({
      specifier: '0.1.0',
      version: '0.1.0',
    });

    expect(importer?.dependencies?.['@arch-platform/core']).toEqual({
      specifier: 'workspace:*',
      version: 'link:../core',
    });
  });

  it('returns a package by name and version', () => {
    const pkg = query.getPackage('@arch-platform/contracts', '0.1.0');

    expect(pkg).toEqual({
      resolution: {
        integrity: 'sha512-test-contracts',
      },
      dependencies: {},
    });
  });

  it('returns undefined when the package does not exist', () => {
    const pkg = query.getPackage('@arch-platform/does-not-exist', '0.1.0');

    expect(pkg).toBeUndefined();
  });

  it('returns a package with peer context', () => {
    const pkg = query.getPackage('eslint', '9.39.4(jiti@2.6.1)');

    expect(pkg).toBeDefined();
  });
  it('returns a package with engine context', () => {
    const pkg = query.getPackage('@babel/code-frame', '7.29.7');
    expect(pkg?.engines).toEqual({
      node: '>=6.9.0',
    });
  });

  it('returns a package with hasBin context', () => {
    const pkg = query.getPackage('@commitlint/cli', '21.0.1');
    expect(pkg?.hasBin).toEqual(true);
  });
  it('returns a package with peerDependencies context', () => {
    const pkg = query.getPackage('typescript-eslint', '8.59.4');
    expect(pkg?.peerDependencies).toEqual({
      eslint: '^8.57.0 || ^9.0.0 || ^10.0.0',
      typescript: '>=4.8.4 <6.1.0',
    });
  });
  it('returns all map packages with versions context', () => {
    const pkgs = query.getPackages('brace-expansion');

    expect([...pkgs.keys()]).toEqual(['1.1.15', '2.1.1', '5.0.6']);

    expect(pkgs.get('1.1.15')).toEqual({
      resolution: {
        integrity: 'sha512-test-brace-expansion',
      },
    });

    expect(pkgs.get('5.0.6')).toEqual({
      resolution: {
        integrity: 'sha512-test-brace-expansion',
      },
      engines: {
        node: '18 || 20 || >=22',
      },
    });
  });
  it('returns an empty map when the package does not exist', () => {
    const query = new DependencyLockfileQuery(dependencyLockfileFixture);

    expect(query.getPackages('unknown-package')).toEqual(new Map());
  });
  it('returns a snapshot by name and version', () => {
    const snapshot = query.getSnapshot('@arch-platform/generator-mvc', '0.1.0');

    expect(snapshot).toEqual({
      dependencies: {
        '@arch-platform/contracts': '0.1.0',
      },
    });
  });

  it('returns undefined when the snapshot does not exist', () => {
    const snapshot = query.getSnapshot('@arch-platform/does-not-exist', '0.1.0');

    expect(snapshot).toBeUndefined();
  });
});
