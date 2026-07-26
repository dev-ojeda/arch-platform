// packages\code-analysis\test\integration\semantic-dependency-analyzer.test.ts

import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { PackageDependencyAnalyzer } from '../../src/package/dependency/package-dependency-analyzer.js';
import { PackageDependencyGraphBuilder } from '../../src/package/dependency/package-dependency-graph-builder.js';
import { DefaultPackageResolver } from '../../src/package/resolvers/default-package-resolver.js';

describe('semantic dependency analyzer', () => {
  it('detects package symbol consumption', () => {
    const project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        baseUrl: '/',
        paths: {
          '@arch/contracts': ['/packages/contracts/src/index.ts'],
        },
      },
    });

    project.createSourceFile(
      '/packages/contracts/src/result.ts',
      `
      export interface BuildResult {}
      `,
    );

    project.createSourceFile(
      '/packages/contracts/src/index.ts',
      `
      export type { BuildResult } from './result';
      `,
    );

    project.createSourceFile(
      '/packages/application/src/service.ts',
      `
      import type { BuildResult } from "@arch/contracts";

      export class Service {
        run(): BuildResult {
          throw new Error();
        }
      }
      `,
    );

    const analyzer = new PackageDependencyAnalyzer(
      new PackageDependencyGraphBuilder(),
      new DefaultPackageResolver(),
    );
    const result = analyzer.analyze(project);

    expect(result.dependencies).toContainEqual({
      fromPackage: '@arch/application',
      toPackage: '@arch/contracts',
      symbols: ['BuildResult'],
    });
  });
});
