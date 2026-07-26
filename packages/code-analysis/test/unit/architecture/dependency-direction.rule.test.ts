// packages/code-analysis/test/unit/architecture/dependency-direction.rule.test.ts

import { describe, expect, it } from 'vitest';

import { DependencyDirectionRule } from '../../../src/architecture/rules/dependency-direction.rule.js';
import { createImport } from '../../fixtures/create-import-fixture.js';
import { createNode } from '../../fixtures/create-node-fixture.js';
import { createSymbolGraph } from '../../fixtures/create-symbol-graph-fixture.js';

describe('DependencyDirectionRule', () => {
  it('should allow dependencies that follow the layer direction', () => {
    const graph = createSymbolGraph({
      nodes: [
        createNode('api-controller', '@arch/api'),
        createNode('application-service', '@arch/application'),
        createNode('domain-service', '@arch/domain'),
      ],
      edges: [
        createImport('api-controller', 'application-service'),
        createImport('application-service', 'domain-service'),
      ],
    });
    const rule = new DependencyDirectionRule({
      layers: ['@arch/api', '@arch/application', '@arch/domain'],
    });

    const result = rule.validate(graph);

    expect(result.passed).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('should reject dependencies that violate the layer direction', () => {
    const graph = createSymbolGraph({
      nodes: [
        createNode('domain-service', '@arch/domain'),
        createNode('application-service', '@arch/application'),
      ],
      edges: [createImport('domain-service', 'application-service')],
    });

    const rule = new DependencyDirectionRule({
      layers: ['@arch/api', '@arch/application', '@arch/domain'],
    });

    const result = rule.validate(graph);

    expect(result.passed).toBe(false);
    expect(result.violations).toHaveLength(1);

    expect(result.violations[0]).toMatchObject({
      fromPackage: '@arch/domain',
      toPackage: '@arch/application',
    });

    expect(result.violations[0].message).toContain('Dependency direction violation');
  });
});
