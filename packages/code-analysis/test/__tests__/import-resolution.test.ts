import { describe, expect, it } from 'vitest';

import { buildImportGraph } from '../../src/graph/build-import-graph.js';

describe('buildImportGraph', () => {
  it('should create resolved file import edges', () => {
    const graph = buildImportGraph([
      {
        sourceFile: '/src/a.ts',
        moduleSpecifier: './build-import-graph.js',
        targetFile: '/src/build-import-graph.ts',
        isRelative: true,
        resolved: true,
        isPackage: true,
      },
    ]);

    expect(graph.edges).toEqual([
      {
        from: '/src/a.ts',
        to: '/src/build-import-graph.ts',
        kind: 'file-import',
        resolved: true,
      },
    ]);
  });

  it('should keep unresolved package imports', () => {
    const graph = buildImportGraph([
      {
        sourceFile: '/src/a.ts',
        moduleSpecifier: '@arch/core',
        targetFile: undefined,
        isRelative: false,
        resolved: false,
        isPackage: true,
      },
    ]);

    expect(graph.edges[0]).toEqual({
      from: '/src/a.ts',
      to: '@arch/core',
      kind: 'package-import',
      resolved: false,
    });
  });
  it('should classify external imports', () => {
    const graph = buildImportGraph([
      {
        sourceFile: '/src/a.ts',
        moduleSpecifier: 'node:path',
        targetFile: undefined,
        isRelative: false,
        resolved: false,
        isPackage: false,
      },
    ]);

    expect(graph.edges[0]).toEqual({
      from: '/src/a.ts',
      to: 'node:path',
      kind: 'external-import',
      resolved: false,
    });
  });
});
