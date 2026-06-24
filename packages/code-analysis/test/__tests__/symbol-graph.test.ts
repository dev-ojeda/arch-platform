// packages/code-analysis/test/__tests__/symbol-graph.test.ts

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { createTsProject } from '../../src/project/ts-project-factory.js';
import { buildSymbolGraph } from '../../src/symbol-graph/build-symbol-graph.js';

const currentDir = fileURLToPath(new URL('.', import.meta.url));

const rootPath = resolve(currentDir, '../../../..');

describe('buildSymbolGraph', () => {
  const project = createTsProject({
    tsConfigFilePath: resolve(rootPath, 'packages/application/tsconfig.json'),
  });

  const graph = buildSymbolGraph(project);

  it('should create graph nodes', () => {
    expect(graph.nodes.length).toBeGreaterThan(0);
  });

  it('should create graph edges collection', () => {
    expect(Array.isArray(graph.edges)).toBe(true);
  });

  it('should only generate known symbol kinds', () => {
    const allowedKinds = new Set(['class', 'interface', 'function']);

    for (const node of graph.nodes) {
      expect(allowedKinds.has(node.kind)).toBe(true);
    }
  });
});
