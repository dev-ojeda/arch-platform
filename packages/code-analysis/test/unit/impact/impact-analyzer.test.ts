// packages\code-analysis\test\unit\impact\impact-analyzer.test.ts

import { describe, expect, it } from 'vitest';

import { ImpactAnalyzer } from '../../../src/impact/impact-analyzer.js';
import { SymbolGraphQuery } from '../../../src/public/symbol-graph-query.js';

describe('ImpactAnalyzer', () => {
  it('should detect dependent symbols', () => {
    const graph = new SymbolGraphQuery({
      nodes: [
        {
          id: 'service',
          name: 'UserService',
          kind: 'class',
          sourceFile: 'service.ts',
          package: '@arch/domain',
        },
        {
          id: 'controller',
          name: 'UserController',
          kind: 'class',
          sourceFile: 'controller.ts',
          package: '@arch/api',
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
