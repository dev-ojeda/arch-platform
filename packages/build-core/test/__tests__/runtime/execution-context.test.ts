// packages/build-core/test/__tests__/runtime/execution-context.test.ts

import { describe, expect, it } from 'vitest';

import type { ExecutionNode, ExecutionPlan } from '../../../src/planning/execution-dag.js';
import { createExecutionContext } from '../../../src/runtime/execution/execution-context.js';

describe('createExecutionContext', () => {
  function createNode(
    name: string,
    dependencies: string[] = [],
    dependents: string[] = [],
  ): ExecutionNode {
    return {
      name,
      dependencies,
      dependents,
      shouldRun: true,
      contract: undefined,
    };
  }

  it('should initialize all execution nodes as pending', () => {
    const plan: ExecutionPlan = {
      nodes: new Map([
        ['package-a', createNode('package-a', [], ['package-b'])],
        ['package-b', createNode('package-b', ['package-a'])],
      ]),
    };

    const context = createExecutionContext(plan);

    expect(context.nodeStates.size).toBe(2);

    expect(context.nodeStates.get('package-a')).toBe('pending');
    expect(context.nodeStates.get('package-b')).toBe('pending');
  });

  it('should create an empty execution context for an empty execution plan', () => {
    const plan: ExecutionPlan = {
      nodes: new Map(),
    };

    const context = createExecutionContext(plan);

    expect(context.nodeStates.size).toBe(0);
  });

  it('should create independent state for each execution context', () => {
    const plan: ExecutionPlan = {
      nodes: new Map([['package-a', createNode('package-a')]]),
    };

    const first = createExecutionContext(plan);
    const second = createExecutionContext(plan);

    first.nodeStates.set('package-a', 'running');

    expect(first.nodeStates.get('package-a')).toBe('running');
    expect(second.nodeStates.get('package-a')).toBe('pending');
  });
});
