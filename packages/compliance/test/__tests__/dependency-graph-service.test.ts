// packages\compliance\test\__tests__\dependency-graph-service.test.ts

import { describe, expect, it } from 'vitest';

import { DependencyGraphService } from '@arch-platform/compliance';

import { dependencyGraphFixture } from '../fixture/create-dependency-graph.js';

describe('DependencyGraphService', () => {
  const service = new DependencyGraphService(dependencyGraphFixture);

  describe('getNode', () => {
    it('returns the dependency node by id', () => {
      const node = service.getNode('ts-morph@25.0.0');

      expect(node.packageName).toBe('ts-morph');
      expect(node.version).toBe('25.0.0');
    });

    it('throws when the dependency node does not exist', () => {
      expect(() => service.getNode('missing@1.0.0')).toThrow(
        'Missing dependency node missing@1.0.0',
      );
    });
  });

  describe('getDependencies', () => {
    it('returns direct dependencies', () => {
      expect(service.getDependencies('ts-morph@25.0.0')).toEqual(['@ts-morph/common@0.26.1']);
    });

    it('returns an empty list for a leaf dependency', () => {
      expect(service.getDependencies('brace-expansion@2.1.1')).toEqual([]);
    });
  });

  describe('getDependents', () => {
    it('returns direct dependents', () => {
      expect(service.getDependents('@ts-morph/common@0.26.1')).toEqual(['ts-morph@25.0.0']);
    });

    it('returns an empty list for the root package', () => {
      expect(service.getDependents('@arch-platform/code-analysis')).toEqual([]);
    });
  });

  describe('getDependencyClosure', () => {
    it('returns the complete transitive dependency closure', () => {
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
    });

    it('includes the requested node in the closure', () => {
      const closure = service.getDependencyClosure('brace-expansion@2.1.1');

      expect(closure).toEqual(new Set(['brace-expansion@2.1.1']));
    });
  });
});
