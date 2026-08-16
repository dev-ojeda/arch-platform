// packages\code-analysis\test\integration\package-dependency-analysis.test.ts

import { describe, expect, it } from 'vitest';

import { PackageDependencyAnalyzer } from '../../src/package/dependency/package-dependency-analyzer.js';
import { PackageDependencyGraphBuilder } from '../../src/package/dependency/package-dependency-graph-builder.js';
import { createSymbolGraph } from '../fixtures/graph/create-empty-symbol-graph.js';
import { createImport } from '../fixtures/symbols/create-import-fixture.js';
import { createNode } from '../fixtures/symbols/create-node-fixture.js';

describe('PackageDependencyAnalyzer', () => {
  it('detects package symbol consumption', () => {
    const symbolGraph = createSymbolGraph({
      nodes: [
        createNode('service', '@arch/application'),
        createNode('BuildResult', '@arch/contracts'),
      ],
      edges: [createImport('service', 'BuildResult')],
    });

    const analyzer = new PackageDependencyAnalyzer(new PackageDependencyGraphBuilder());

    const result = analyzer.analyze(symbolGraph);

    expect(result.dependencies).toContainEqual({
      fromPackage: '@arch/application',
      toPackage: '@arch/contracts',
      symbols: ['BuildResult'],
    });
  });
});
