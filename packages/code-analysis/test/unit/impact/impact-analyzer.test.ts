// packages\code-analysis\test\unit\impact\impact-analyzer.test.ts

import { describe, expect, it } from 'vitest';

import { ImpactAnalyzer } from '../../../src/impact/impact-analyzer.js';
import { SymbolDependencyGraph } from '../../../src/symbols/model/symbol-dependency-graph.js';

describe('ImpactAnalyzer', () => {
  it('should detect dependent symbols', () => {
    const graph = new SymbolDependencyGraph({
      nodes: [
        {
          id: 'service',
          name: 'UserService',
          kind: 'class',
          sourceFile: 'service.ts',
          package: '@arch/domain',
          exported: true,
        },
        {
          id: 'controller',
          name: 'UserController',
          kind: 'class',
          sourceFile: 'controller.ts',
          package: '@arch/api',
          exported: true,
        },
      ],

      edges: [
        {
          from: 'controller',
          to: 'service',
          type: 'call',
        },
      ],
    });

    const analyzer = new ImpactAnalyzer(graph);

    const result = analyzer.analyze('service');

    expect(result.affectedSymbols).toContain('controller');

    expect(result.affectedPackages).toContain('@arch/api');
  });
});
