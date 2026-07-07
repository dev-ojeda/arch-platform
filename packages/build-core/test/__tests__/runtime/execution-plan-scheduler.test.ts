// packages/build-core/test/__tests__/runtime/execution-plan-scheduler.test.ts

import { describe, expect, it, vi } from 'vitest';

import type { BuildResult } from '../../../src/executor/build-result.js';
import type { BuildTaskRunner } from '../../../src/graph/build-task-runner.js';
import type { ExecutionPlan } from '../../../src/planning/execution-dag.js';
import { createExecutionContext } from '../../../src/runtime/execution/execution-context.js';
import { ExecutionPlanScheduler } from '../../../src/runtime/execution/execution-plan-scheduler.js';

describe('ExecutionPlanScheduler', () => {
  function createSuccessResult(packageName: string): BuildResult {
    return {
      package: packageName,
      status: 'success',
      changeReason: 'source',
      execution: {
        reason: 'executed',
      },
      cache: {
        decision: 'miss',
        action: 'none',
      },
    };
  }

  function createPlan(nodes: ExecutionPlan['nodes']): ExecutionPlan {
    return {
      nodes,
    };
  }

  function createNode(name: string, dependencies: string[] = [], dependents: string[] = []) {
    return {
      name,
      dependencies,
      dependents,
      shouldRun: true,
      contract: undefined,
    };
  }

  it('should execute a node without dependencies and mark it as success', async () => {
    const runner = {
      run: vi.fn().mockResolvedValue(createSuccessResult('package-a')),
    } as unknown as BuildTaskRunner;

    const plan = createPlan(new Map([['package-a', createNode('package-a')]]));

    const context = createExecutionContext(plan);

    const scheduler = new ExecutionPlanScheduler(runner, 1);

    const results = await scheduler.run(plan, context);

    expect(runner.run).toHaveBeenCalledWith('package-a');

    expect(context.nodeStates.get('package-a')).toBe('success');

    expect(results).toContainEqual(
      expect.objectContaining({
        package: 'package-a',
        status: 'success',
      }),
    );
  });

  it('should execute dependent nodes only after dependencies succeed', async () => {
    let resolvePackageA!: (result: BuildResult) => void;

    const packageACompletion = new Promise<BuildResult>((resolve) => {
      resolvePackageA = resolve;
    });

    const runner = {
      run: vi.fn((name: string) =>
        name === 'package-a' ? packageACompletion : Promise.resolve(createSuccessResult(name)),
      ),
    } as unknown as BuildTaskRunner;

    const plan = createPlan(
      new Map([
        ['package-a', createNode('package-a', [], ['package-b'])],
        ['package-b', createNode('package-b', ['package-a'])],
      ]),
    );

    const context = createExecutionContext(plan);

    const scheduler = new ExecutionPlanScheduler(runner, 1);

    const execution = scheduler.run(plan, context);

    await Promise.resolve();

    expect(runner.run).toHaveBeenCalledTimes(1);
    expect(context.nodeStates.get('package-a')).toBe('running');
    expect(context.nodeStates.get('package-b')).toBe('pending');

    resolvePackageA(createSuccessResult('package-a'));

    await execution;

    expect(context.nodeStates.get('package-a')).toBe('success');
    expect(context.nodeStates.get('package-b')).toBe('success');
  });

  it('should skip dependent nodes when a dependency fails', async () => {
    const runner = {
      run: vi.fn(() => {
        throw new Error('build failed');
      }),
    } as unknown as BuildTaskRunner;

    const plan = createPlan(
      new Map([
        ['package-a', createNode('package-a', [], ['package-b'])],
        ['package-b', createNode('package-b', ['package-a'])],
      ]),
    );

    const context = createExecutionContext(plan);

    const scheduler = new ExecutionPlanScheduler(runner, 1);

    const results = await scheduler.run(plan, context);

    expect(runner.run).toHaveBeenCalledTimes(1);

    expect(context.nodeStates.get('package-a')).toBe('failed');
    expect(context.nodeStates.get('package-b')).toBe('skipped');

    expect(results).toContainEqual(
      expect.objectContaining({
        package: 'package-b',
        status: 'skipped',
        changeReason: 'dependency-failed',
      }),
    );
  });
});
