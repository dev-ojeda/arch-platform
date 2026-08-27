// packages/build-core/src/graph/build-task-runner.ts

import type {
  ArtifactCache,
  ArtifactProvider,
  ArtifactState,
  DagNode,
  Graph,
  OutputValidator,
  StateWriter,
} from '@arch/platform-model';

import type { BuildExecutor } from '../executor/build-executor.js';
import type { BuildResult } from '../executor/build-result.js';
import type { ExecutionReason } from '../executor/execution-types.js';
import { BuildPlan } from '../planning/build-plan.js';
import type { BuildPlanEntry } from '../planning/plan-entry.js';

export class BuildTaskRunner {
  private readonly artifactStates = new Map<string, ArtifactState>();

  constructor(
    private readonly graph: Graph,
    private readonly executor: BuildExecutor,
    private readonly plan: BuildPlan,
    private readonly writer: StateWriter,
    private readonly artifactCache: ArtifactCache,
    private readonly outputValidator: OutputValidator,
    private readonly artifactProvider: ArtifactProvider,
  ) {}

  async run(name: string): Promise<BuildResult> {
    const node = this.requireNode(name);
    const entry = this.requirePlan(name);

    const startedAt = Date.now();

    const result = await this.executeBuildAction(node, entry);

    const finishedAt = Date.now();

    this.recordArtifactState(node, entry, result, startedAt, finishedAt);

    return result;
  }

  getArtifactStates(): ReadonlyMap<string, ArtifactState> {
    return this.artifactStates;
  }

  private requireNode(name: string): DagNode {
    const node = this.graph.get(name);

    if (!node) {
      throw new Error(`Missing node ${name}`);
    }

    return node;
  }

  private requirePlan(name: string): BuildPlanEntry {
    const plan = this.plan.get(name);

    if (!plan) {
      throw new Error(`Missing plan ${name}`);
    }

    return plan;
  }

  private createResult(
    entry: BuildPlanEntry,
    status: BuildResult['status'],
    reason: ExecutionReason,
  ): BuildResult {
    return {
      package: entry.package,
      status,
      changeReason: entry.changeReason,
      execution: {
        reason,
      },
    };
  }

  private async executeAndCache(node: DagNode, entry: BuildPlanEntry): Promise<BuildResult> {
    const result = await this.executor.execute(node, entry);

    if (result.status !== 'success') {
      return result;
    }

    if (node.outputs.length > 0 && !(await this.outputValidator.exists(node.root, node.outputs))) {
      throw new Error(
        [
          'Build completed but declared outputs are missing.',
          `package=${node.name}`,
          `outputs=${node.outputs.join(', ')}`,
        ].join(' '),
      );
    }

    const artifact = this.artifactProvider.create(node.name, entry.hash);

    await this.artifactCache.save(artifact, node.root, node.outputs);

    this.writer.commit(node, entry.hash);

    return result;
  }

  private async restore(node: DagNode, entry: BuildPlanEntry): Promise<BuildResult> {
    const artifact = this.artifactProvider.create(node.name, entry.hash);

    const restored = await this.artifactCache.restore(artifact, node.root);

    if (!restored) {
      return this.executeAndCache(node, entry);
    }

    this.writer.commit(node, entry.hash);

    return this.createResult(entry, 'skipped', 'restored');
  }

  private async executeBuildAction(node: DagNode, entry: BuildPlanEntry): Promise<BuildResult> {
    switch (entry.buildAction) {
      case 'restore':
        return this.restore(node, entry);

      case 'skip':
        return this.createResult(entry, 'skipped', 'cached');

      case 'execute':
        return this.executeAndCache(node, entry);
    }
  }

  private recordArtifactState(
    node: DagNode,
    entry: BuildPlanEntry,
    result: BuildResult,
    startedAt: number,
    finishedAt: number,
  ): void {
    const status = this.resolveArtifactStatus(result);

    if (!status) {
      return;
    }

    this.artifactStates.set(node.name, {
      hash: entry.hash,
      dependencies: [...node.dependencies],
      status,
      startedAt,
      finishedAt,
      schemaVersion: 1,
    });
  }

  private resolveArtifactStatus(result: BuildResult): ArtifactState['status'] | undefined {
    switch (result.execution.reason) {
      case 'executed':
        return 'built';

      case 'restored':
        return 'restored';

      case 'cached':
        return 'cached';

      default:
        return undefined;
    }
  }
}
