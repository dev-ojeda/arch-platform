import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { buildModuleImports } from '../../src/module/build-module.js';
import { DefaultPackageResolver } from '../../src/package/resolvers/default-package-resolver.js';

describe('buildModuleImports', () => {
  const packageResolver = new DefaultPackageResolver();

  function createSourceFile(code: string) {
    const project = new Project({
      useInMemoryFileSystem: true,
    });

    return project.createSourceFile('/packages/app/src/service.ts', code);
  }

  it('classifies relative imports', () => {
    const sourceFile = createSourceFile(`
      import { Foo } from './foo.js';
    `);

    const [reference] = buildModuleImports(sourceFile, packageResolver);

    expect(reference).toMatchObject({
      moduleSpecifier: './foo.js',
      kind: 'relative',
      packageName: undefined,
    });
  });

  it('classifies package imports', () => {
    const sourceFile = createSourceFile(`
      import { logger } from '@arch/core';
    `);

    const [reference] = buildModuleImports(sourceFile, packageResolver);

    expect(reference).toMatchObject({
      moduleSpecifier: '@arch/core',
      kind: 'package',
      packageName: '@arch/core',
    });
  });

  it('classifies external imports', () => {
    const sourceFile = createSourceFile(`
      import { resolve } from 'node:path';
    `);

    const [reference] = buildModuleImports(sourceFile, packageResolver);

    expect(reference).toMatchObject({
      moduleSpecifier: 'node:path',
      kind: 'external',
      packageName: 'node:path',
    });
  });

  it('returns an empty collection when there are no imports', () => {
    const sourceFile = createSourceFile(`
      export class Service {}
    `);

    expect(buildModuleImports(sourceFile, packageResolver)).toEqual([]);
  });
});
