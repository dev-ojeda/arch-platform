// packages\code-analysis\test\integration\semantic-dependency-analyzer.test.ts

import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { PackageDependencyGraphBuilder } from '../../src/symbol-dependencies/package-dependency-graph-builder.js';
import { SemanticDependencyAnalyzer } from '../../src/symbol-dependencies/semantic-dependency-analyzer.js';

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

    const analyzer = new SemanticDependencyAnalyzer(new PackageDependencyGraphBuilder());
    const result = analyzer.analyze(project);

    expect(result.dependencies).toContainEqual({
      fromPackage: '@arch/application',
      toPackage: '@arch/contracts',
      symbols: ['BuildResult'],
    });
  });
});
