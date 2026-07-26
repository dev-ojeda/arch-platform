// packages/code-analysis/test/unit/architecture/package-boundaries.rule.test.ts

import { describe, expect, it } from 'vitest';

import { PackageBoundariesRule } from '../../../src/architecture/rules/package-boundaries.rule.js';
import { createImport } from '../../fixtures/create-import-fixture.js';
import { createNode } from '../../fixtures/create-node-fixture.js';
import { createSymbolGraph } from '../../fixtures/create-symbol-graph-fixture.js';

describe('PackageBoundariesRule', () => {
  it('should allow valid package dependency', () => {
    const graph = createSymbolGraph({
      nodes: [
        createNode('api-controller', '@arch/api'),
        createNode('app-service', '@arch/application'),
      ],
      edges: [createImport('api-controller', 'app-service')],
    });
    const rule = new PackageBoundariesRule({
      '@arch/api': ['@arch/application'],
    });

    const result = rule.validate(graph);

    expect(result.passed).toBe(true);

    expect(result.violations).toHaveLength(0);
  });

  it('should reject forbidden package dependency', () => {
    const graph = createSymbolGraph({
      nodes: [
        createNode('domain-model', '@arch/domain'),
        createNode('infra-db', '@arch/infrastructure'),
      ],
      edges: [createImport('domain-model', 'infra-db')],
    });

    const rule = new PackageBoundariesRule({
      '@arch/domain': [],
    });

    const result = rule.validate(graph);

    expect(result.passed).toBe(false);
    expect(result.violations).toHaveLength(1);

    expect(result.violations[0].fromPackage).toBe('@arch/domain');
    expect(result.violations[0].toPackage).toBe('@arch/infrastructure');
  });
});
