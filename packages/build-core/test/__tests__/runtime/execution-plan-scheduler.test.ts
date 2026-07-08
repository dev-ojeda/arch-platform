// packages/build-core/test/__tests__/runtime/execution-plan-scheduler.test.ts

import { describe, expect, it } from 'vitest';

import type { BuildResult } from '../../../src/executor/build-result.js';
import { createSuccessResult } from '../../helpers/build-result.js';
import { createBuildTaskRunner } from '../../helpers/build-task-runner.js';
import { createDeferred } from '../../helpers/deferred.js';
import { createNode, createPlan, createScheduler } from '../../helpers/execution-plan.js';

describe('ExecutionPlanScheduler', () => {
  it('should execute a node without dependencies and mark it as success', async () => {
    const runner = createBuildTaskRunner(() => Promise.resolve(createSuccessResult('package-a')));

    const plan = createPlan(createNode('package-a'));

    const { scheduler, context } = createScheduler(plan, runner);

    const results = await scheduler.run(plan, context);

    expect(runner.run).toHaveBeenCalledWith('package-a');

    expect(context.nodes.get('package-a')?.state).toBe('success');

    expect(results).toContainEqual(
      expect.objectContaining({
        package: 'package-a',
        status: 'success',
      }),
    );
  });

  it('should execute dependent nodes only after dependencies succeed', async () => {
    const packageACompletion = createDeferred<BuildResult>();

    const runner = createBuildTaskRunner((name: string) =>
      name === 'package-a'
        ? packageACompletion.promise
        : Promise.resolve(createSuccessResult(name)),
    );

    const plan = createPlan(
      createNode('package-a', {
        dependents: ['package-b'],
      }),
      createNode('package-b', {
        dependencies: ['package-a'],
      }),
    );

    const { scheduler, context } = createScheduler(plan, runner);

    const execution = scheduler.run(plan, context);

    await Promise.resolve();

    expect(runner.run).toHaveBeenCalledTimes(1);

    expect(context.nodes.get('package-a')?.state).toBe('running');
    expect(context.nodes.get('package-b')?.state).toBe('pending');

    packageACompletion.resolve(createSuccessResult('package-a'));

    await execution;

    expect(context.nodes.get('package-a')?.state).toBe('success');
    expect(context.triggers.get('package-b')).toEqual({
      package: 'package-a',
      reason: 'dependency-changed',
    });
  });

  it('should skip dependent nodes when a dependency fails', async () => {
    const runner = createBuildTaskRunner(() => {
      throw new Error('build failed');
    });

    const plan = createPlan(
      createNode('package-a', {
        dependents: ['package-b'],
      }),
      createNode('package-b', {
        dependencies: ['package-a'],
      }),
    );

    const { scheduler, context } = createScheduler(plan, runner);

    const results = await scheduler.run(plan, context);

    expect(runner.run).toHaveBeenCalledTimes(1);

    expect(context.nodes.get('package-a')?.state).toBe('failed');
    expect(context.nodes.get('package-b')?.state).toBe('skipped');

    expect(results).toContainEqual(
      expect.objectContaining({
        package: 'package-a',
        status: 'failed',
      }),
    );

    expect(results).toContainEqual(
      expect.objectContaining({
        package: 'package-b',
        status: 'skipped',
        changeReason: 'dependency-failed',
      }),
    );
  });

  it('should execute independent nodes concurrently up to the configured limit', async () => {
    const packageACompletion = createDeferred<BuildResult>();
    const packageBCompletion = createDeferred<BuildResult>();

    const runner = createBuildTaskRunner((name: string) => {
      switch (name) {
        case 'package-a':
          return packageACompletion.promise;

        case 'package-b':
          return packageBCompletion.promise;

        default:
          throw new Error(`Unexpected package: ${name}`);
      }
    });

    const plan = createPlan(createNode('package-a'), createNode('package-b'));

    const { scheduler, context } = createScheduler(plan, runner, 2);

    const execution = scheduler.run(plan, context);

    await Promise.resolve();

    expect(runner.run).toHaveBeenCalledTimes(2);

    expect(runner.run).toHaveBeenCalledWith('package-a');
    expect(runner.run).toHaveBeenCalledWith('package-b');

    expect(context.nodes.get('package-a')?.state).toBe('running');
    expect(context.nodes.get('package-b')?.state).toBe('running');

    packageACompletion.resolve(createSuccessResult('package-a'));
    packageBCompletion.resolve(createSuccessResult('package-b'));

    await execution;

    expect(context.nodes.get('package-a')?.state).toBe('success');
    expect(context.nodes.get('package-b')?.state).toBe('success');
  });
});
