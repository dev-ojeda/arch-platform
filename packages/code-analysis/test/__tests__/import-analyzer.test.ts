// packages/code-analysis/test/__tests__/import-analyzer.test.ts

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { buildProjectImportGraph } from '../../src/graph/build-import-project-graph.js';
import { createTsProject } from '../../src/project/ts-project-factory.js';

const currentDir = fileURLToPath(new URL('.', import.meta.url));

const rootPath = resolve(currentDir, '../../../..');

describe('buildProjectImportGraph', () => {
  const project = createTsProject({
    tsConfigFilePath: resolve(rootPath, 'packages/application/tsconfig.json'),
  });

  const graph = buildProjectImportGraph(project);

  it('should create graph nodes', () => {
    expect(graph.nodes.length).toBeGreaterThan(1);
  });

  it('should create graph edges', () => {
    expect(graph.edges.length).toBeGreaterThan(1);
  });

  it('should only generate known edge kinds', () => {
    const allowedKinds = new Set(['file-import', 'package-import', 'external-import']);

    for (const edge of graph.edges) {
      expect(allowedKinds.has(edge.kind)).toBe(true);
    }
  });
});
