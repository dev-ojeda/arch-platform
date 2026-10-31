import { describe, expect, it, vi } from 'vitest';

import type {
  ArtifactCache,
  ArtifactOutputPreparer,
  ArtifactProvider,
  DagNode,
  Graph,
  OutputValidator,
  StateWriter,
} from '@arch-platform/platform-model';

import type { BuildExecutor } from '../../../src/executor/build-executor.js';
import type { BuildResult } from '../../../src/executor/build-result.js';
import { BuildTaskRunner } from '../../../src/graph/build-task-runner.js';
import { BuildPlan } from '../../../src/planning/build-plan.js';
import type { BuildPlanEntry } from '../../../src/planning/plan-entry.js';

const node: DagNode = {
  name: 'package-a',
  root: '/workspace/packages/package-a',
  dependencies: [],
  dependents: [],
  outputs: ['dist'],
  artifactType: 'runtime',
};

const hash = {
  hash: 'hash-a',
  sourceHash: 'source-a',
  configHash: 'config-a',
  depsHash: 'deps-a',
  schemaVersion: 1,
};

function createEntry(buildAction: BuildPlanEntry['buildAction']): BuildPlanEntry {
  return {
    package: node.name,
    buildAction,
    cache: { decision: buildAction === 'restore' ? 'restore' : 'miss' },
    changeReason: 'source',
    hash,
  };
}

function createHarness(buildAction: BuildPlanEntry['buildAction'] = 'execute') {
  const events: string[] = [];
  const graph: Graph = new Map([[node.name, node]]);
  const plan = new BuildPlan();
  plan.set(node.name, createEntry(buildAction));

  const executor: BuildExecutor = {
    execute: vi.fn(async (): Promise<BuildResult> => {
      events.push('execute');
      return {
        package: node.name,
        status: 'success',
        changeReason: 'source',
        execution: { reason: 'executed' },
      };
    }),
  };

  const writer: StateWriter = {
    write: vi.fn(async () => undefined),
    commit: vi.fn(() => events.push('commit')),
    prune: vi.fn(),
    getChanges: vi.fn(() => ({
      created: new Set<string>(),
      updated: new Set<string>(),
      deleted: new Set<string>(),
    })),
  };

  const artifact = { packageName: node.name, id: hash.hash };
  const artifactProvider: ArtifactProvider = {
    create: vi.fn(() => artifact),
  };

  const artifactCache: ArtifactCache = {
    exists: vi.fn(async () => false),
    save: vi.fn(async () => {
      events.push('save');
    }),
    restore: vi.fn(async () => false),
    verifyOutputs: vi.fn(async () => true),
  };

  const outputValidator: OutputValidator = {
    exists: vi.fn(async () => {
      events.push('validate');
      return true;
    }),
  };

  const artifactOutputPreparer: ArtifactOutputPreparer = {
    prepare: vi.fn(async () => {
      events.push('prepare');
    }),
  };

  const runner = new BuildTaskRunner(
    graph,
    executor,
    plan,
    writer,
    artifactCache,
    outputValidator,
    artifactProvider,
    artifactOutputPreparer,
  );

  return {
    runner,
    events,
    executor,
    writer,
    artifactCache,
    outputValidator,
    artifactProvider,
    artifactOutputPreparer,
  };
}

describe('BuildTaskRunner', () => {
  it('prepares outputs before execution, validates them, saves the artifact and commits state', async () => {
    const h = createHarness();
    const result = await h.runner.run(node.name);

    expect(result.status).toBe('success');
    expect(h.events).toEqual(['prepare', 'execute', 'validate', 'save', 'commit']);
    expect(h.artifactOutputPreparer.prepare).toHaveBeenCalledWith(node.root, node.outputs);
    expect(h.artifactCache.save).toHaveBeenCalledWith(
      { packageName: node.name, id: hash.hash },
      node.root,
      node.outputs,
    );
    expect(h.writer.commit).toHaveBeenCalledWith(node, hash);
  });

  it('does not cache or commit when the executor returns a failed result', async () => {
    const h = createHarness();
    vi.mocked(h.executor.execute).mockResolvedValue({
      package: node.name,
      status: 'failed',
      changeReason: 'source',
      execution: { reason: 'failed' },
    });

    const result = await h.runner.run(node.name);

    expect(result.status).toBe('failed');
    expect(h.artifactOutputPreparer.prepare).toHaveBeenCalledOnce();
    expect(h.artifactCache.save).not.toHaveBeenCalled();
    expect(h.writer.commit).not.toHaveBeenCalled();
    expect(h.outputValidator.exists).not.toHaveBeenCalled();
  });

  it('throws when declared outputs are missing and does not cache or commit', async () => {
    const h = createHarness();
    vi.mocked(h.outputValidator.exists).mockResolvedValue(false);

    await expect(h.runner.run(node.name)).rejects.toThrow(
      'Build completed but declared outputs are missing.',
    );

    expect(h.artifactCache.save).not.toHaveBeenCalled();
    expect(h.writer.commit).not.toHaveBeenCalled();
  });

  it('does not execute or prepare outputs when restore succeeds', async () => {
    const h = createHarness('restore');
    vi.mocked(h.artifactCache.restore).mockResolvedValue(true);

    const result = await h.runner.run(node.name);

    expect(result).toMatchObject({
      package: node.name,
      status: 'skipped',
      execution: { reason: 'restored' },
    });
    expect(h.artifactOutputPreparer.prepare).not.toHaveBeenCalled();
    expect(h.executor.execute).not.toHaveBeenCalled();
    expect(h.artifactCache.save).not.toHaveBeenCalled();
    expect(h.writer.commit).toHaveBeenCalledWith(node, hash);
  });

  it('prepares outputs before executing when restore fails', async () => {
    const h = createHarness('restore');
    vi.mocked(h.artifactCache.restore).mockResolvedValue(false);

    const result = await h.runner.run(node.name);

    expect(result.status).toBe('success');
    expect(h.events).toEqual(['prepare', 'execute', 'validate', 'save', 'commit']);
    expect(h.artifactOutputPreparer.prepare).toHaveBeenCalledOnce();
    expect(h.executor.execute).toHaveBeenCalledOnce();
  });

  it('does not prepare, execute, restore or save when the plan says skip', async () => {
    const h = createHarness('skip');

    const result = await h.runner.run(node.name);

    expect(result).toMatchObject({
      package: node.name,
      status: 'skipped',
      execution: { reason: 'cached' },
    });
    expect(h.artifactOutputPreparer.prepare).not.toHaveBeenCalled();
    expect(h.executor.execute).not.toHaveBeenCalled();
    expect(h.artifactCache.restore).not.toHaveBeenCalled();
    expect(h.artifactCache.save).not.toHaveBeenCalled();
    expect(h.writer.commit).not.toHaveBeenCalled();
  });

  it('does not execute the builder if output preparation fails', async () => {
    const h = createHarness();
    vi.mocked(h.artifactOutputPreparer.prepare).mockRejectedValue(new Error('prepare failed'));

    await expect(h.runner.run(node.name)).rejects.toThrow('prepare failed');

    expect(h.executor.execute).not.toHaveBeenCalled();
    expect(h.artifactCache.save).not.toHaveBeenCalled();
    expect(h.writer.commit).not.toHaveBeenCalled();
  });

  it('does not validate or cache when the node declares no outputs', async () => {
    const h = createHarness();
    const nodeWithoutOutputs: DagNode = { ...node, outputs: [] };
    const graph: Graph = new Map([[nodeWithoutOutputs.name, nodeWithoutOutputs]]);
    const plan = new BuildPlan();
    plan.set(node.name, createEntry('execute'));
    const runner = new BuildTaskRunner(
      graph,
      h.executor,
      plan,
      h.writer,
      h.artifactCache,
      h.outputValidator,
      h.artifactProvider,
      h.artifactOutputPreparer,
    );

    const result = await runner.run(node.name);

    expect(result.status).toBe('success');
    expect(h.artifactOutputPreparer.prepare).toHaveBeenCalledWith(node.root, []);
    expect(h.outputValidator.exists).not.toHaveBeenCalled();
    expect(h.artifactCache.save).toHaveBeenCalledWith(
      { packageName: node.name, id: hash.hash },
      node.root,
      [],
    );
  });

  it('throws for a missing graph node', async () => {
    const h = createHarness();

    await expect(h.runner.run('missing')).rejects.toThrow('Missing node missing');
  });

  it('throws for a missing build plan entry', async () => {
    const h = createHarness();
    const emptyPlan = new BuildPlan();
    const runner = new BuildTaskRunner(
      new Map([[node.name, node]]),
      h.executor,
      emptyPlan,
      h.writer,
      h.artifactCache,
      h.outputValidator,
      h.artifactProvider,
      h.artifactOutputPreparer,
    );

    await expect(runner.run(node.name)).rejects.toThrow(`Missing plan ${node.name}`);
  });
});
