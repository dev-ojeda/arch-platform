// packages\compliance\test\__tests__\security-advisory-correlation.test.ts

import { describe, expect, it } from 'vitest';

import { DependencyGraphService } from '@arch-platform/compliance';

import { dependencyGraphFixture } from '../fixture/create-dependency-graph.js';

describe('Artifact security correlation', () => {
  const service = new DependencyGraphService(dependencyGraphFixture);
  it('correlates advisories only for dependencies in the artifact closure', () => {
    const closure = service.getDependencyClosure('@arch-platform/code-analysis');

    expect(closure).toEqual(
      new Set([
        '@arch-platform/code-analysis',
        'ts-morph@25.0.0',
        '@ts-morph/common@0.26.1',
        'minimatch@9.0.9',
        'brace-expansion@2.1.1',
        'typescript@5.9.2',
      ]),
    );
    expect(closure).not.toContain('brace-expansion@1.1.15');
    expect(closure).not.toContain('brace-expansion@5.0.6');
    // ...
  });
});
