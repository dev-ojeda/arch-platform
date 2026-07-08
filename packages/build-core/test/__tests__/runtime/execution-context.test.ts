// packages/build-core/test/__tests__/runtime/execution-context.test.ts

import { describe, expect, it } from 'vitest';

import {
  createExecutionContext,
  updateExecutionState,
} from '../../../src/runtime/execution/execution-context.js';
import { createNode, createPlan } from '../../helpers/execution-plan.js';

describe('createExecutionContext', () => {
  it('should initialize all execution nodes as pending', () => {
    const plan = createPlan(
      createNode('package-a', {
        dependents: ['package-b'],
      }),
      createNode('package-b', {
        dependencies: ['package-a'],
      }),
    );

    const context = createExecutionContext(plan);

    expect(context.nodes.size).toBe(2);

    expect(context.nodes.get('package-a')?.state).toBe('pending');

    expect(context.nodes.get('package-b')?.state).toBe('pending');
  });

  it('should create an empty execution context for an empty execution plan', () => {
    const plan = createPlan();

    const context = createExecutionContext(plan);

    expect(context.nodes.size).toBe(0);
  });

  it('should create independent state for each execution context', () => {
    const plan = createPlan(createNode('package-a'));

    const first = createExecutionContext(plan);
    const second = createExecutionContext(plan);

    updateExecutionState(first, 'package-a', 'running');

    expect(first.nodes.get('package-a')?.state).toBe('running');

    expect(second.nodes.get('package-a')?.state).toBe('pending');
  });
});
