// packages/build-core/src/graph/build-task-runner.ts

import type {
  ArtifactCache,
  ArtifactProvider,
  DagNode,
  Graph,
  OutputValidator,
} from '@arch/platform-model';

import type { BuildExecutor } from '../executor/build-executor.js';
import type { BuildResult } from '../executor/build-result.js';
import type { ExecutionReason } from '../executor/execution-types.js';
import { BuildPlan } from '../planning/build-plan.js';
import type { BuildPlanEntry } from '../planning/plan-entry.js';
import { BuildStateWriter } from '../state/state-writer.js';

export class BuildTaskRunner {
  constructor(
    private graph: Graph,
    private executor: BuildExecutor,
    private plan: BuildPlan,
    private writer: BuildStateWriter,
    private artifactCache: ArtifactCache,
    private outputValidator: OutputValidator,
    private artifactProvider: ArtifactProvider,
  ) {}

  async run(name: string): Promise<BuildResult> {
    const node = this.requireNode(name);
    const entry = this.requirePlan(name);

    return this.executeBuildAction(node, entry);
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
}
