// packages/code-analysis/src/test/__tests__/import-analyzer.test.ts
import { describe, expect, it } from 'vitest';

import { buildProjectImportGraph } from '../../src/graph/build-project-import-graph.js';
import { createTsProject } from '../../src/project/ts-project-factory.js';

describe('buildProjectImportGraph', () => {
  it('should create graph nodes', () => {
    const project = createTsProject({
      tsConfigFilePath: '../../packages/application/tsconfig.json',
    });

    const graph = buildProjectImportGraph(project);

    expect(graph.nodes.length).toBeGreaterThan(0);
  });

  it('should create graph edges', () => {
    const project = createTsProject({
      tsConfigFilePath: '../../packages/application/tsconfig.json',
    });

    const graph = buildProjectImportGraph(project);

    expect(graph.edges.length).toBeGreaterThan(0);
  });
});
