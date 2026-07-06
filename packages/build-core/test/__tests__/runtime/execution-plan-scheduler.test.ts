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
  it('should execute a node without dependencies and mark it as success', async () => {
    const runner = {
      run: vi.fn().mockResolvedValue({
        package: 'package-a',
        status: 'success',
        changeReason: 'source',
        execution: {
          reason: 'executed',
        },
        cache: {
          decision: 'miss',
          action: 'none',
        },
      }),
    } as unknown as BuildTaskRunner;

    const plan: ExecutionPlan = {
      nodes: new Map([
        [
          'package-a',
          {
            name: 'package-a',
            dependencies: [],
            dependents: [],
            shouldRun: true,
            contract: undefined,
          },
        ],
      ]),
    };

    const context = createExecutionContext(plan);

    const scheduler = new ExecutionPlanScheduler(runner, 1);

    const results = await scheduler.run(plan, context);

    expect(runner.run).toHaveBeenCalledTimes(1);
    expect(runner.run).toHaveBeenCalledWith('package-a');

    expect(context.nodeStates.get('package-a')).toBe('success');

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      package: 'package-a',
      status: 'success',
    });
  });
  it('should execute dependent nodes only after dependencies succeed', async () => {
    let resolvePackageA!: (result: BuildResult) => void;

    const packageACompletion = new Promise<BuildResult>((resolve) => {
      resolvePackageA = resolve;
    });

    const runner = {
      run: vi.fn((name: string) => {
        if (name === 'package-a') {
          return packageACompletion;
        }

        return Promise.resolve(createSuccessResult(name));
      }),
    } as unknown as BuildTaskRunner;

    const plan: ExecutionPlan = {
      nodes: new Map([
        [
          'package-a',
          {
            name: 'package-a',
            dependencies: [],
            dependents: ['package-b'],
            shouldRun: true,
            contract: undefined,
          },
        ],
        [
          'package-b',
          {
            name: 'package-b',
            dependencies: ['package-a'],
            dependents: [],
            shouldRun: true,
            contract: undefined,
          },
        ],
      ]),
    };

    const context = createExecutionContext(plan);

    const scheduler = new ExecutionPlanScheduler(runner, 1);

    const execution = scheduler.run(plan, context);

    await Promise.resolve();

    expect(runner.run).toHaveBeenCalledTimes(1);
    expect(runner.run).toHaveBeenCalledWith('package-a');

    expect(context.nodeStates.get('package-a')).toBe('running');
    expect(context.nodeStates.get('package-b')).toBe('pending');

    resolvePackageA(createSuccessResult('package-a'));

    await execution;

    expect(runner.run).toHaveBeenCalledWith('package-b');

    expect(context.nodeStates.get('package-a')).toBe('success');
    expect(context.nodeStates.get('package-b')).toBe('success');
  });
});
