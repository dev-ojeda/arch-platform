// packages/build-core/src/graph/build-task-runner.ts

import type { ArtifactCache } from '../artifact/artifact-cache.js';
import type { DefaultArtifactProvider } from '../artifact/default-artifact-provider.js';
import type { OutputValidator } from '../artifact/output-validator.js';
import type { BuildExecutor } from '../executor/build-executor.js';
import type { BuildResult } from '../executor/build-result.js';
import type { BuildPlan } from '../planning/build-plan.js';
import type { BuildPlanEntry } from '../planning/plan-entry.js';
import type { BuildStateWriter } from '../state/state-writer.js';

import type { DagNode, Graph } from './dag-types.js';

export class BuildTaskRunner {
  constructor(
    private graph: Graph,
    private executor: BuildExecutor,
    private plan: BuildPlan,
    private writer: BuildStateWriter,
    private artifactCache: ArtifactCache,
    private outputValidator: OutputValidator,
    private defaultArtifactProvider: DefaultArtifactProvider,
  ) {}

  async run(name: string): Promise<BuildResult> {
    const node = this.requireNode(name);
    const entry = this.requirePlan(name);

    if (entry.cache.action === 'restore') {
      return this.restore(node, entry);
    }

    if (entry.cache.decision === 'hit') {
      return this.createCachedResult(entry);
    }

    return this.executeAndCache(node, entry);
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

  private createCachedResult(plan: BuildPlanEntry): BuildResult {
    return {
      package: plan.package,
      status: 'skipped',

      changeReason: plan.changeReason,

      execution: {
        reason: 'cached',
      },

      cache: {
        decision: plan.cache.decision,
        action: plan.cache.action,
      },
    };
  }
  private async executeAndCache(node: DagNode, entry: BuildPlanEntry): Promise<BuildResult> {
    const result = await this.executor.execute(node, entry);

    if (result.status !== 'success') {
      return result;
    }

    if (node.outputs.length > 0 && !this.outputValidator.exists(node.root, node.outputs)) {
      throw new Error(
        [
          `Build completed but declared outputs are missing.`,
          `package=${node.name}`,
          `outputs=${node.outputs.join(', ')}`,
        ].join(' '),
      );
    }

    const artifact = this.defaultArtifactProvider.create(node.name, entry.hash);

    await this.artifactCache.save(artifact, node.root, node.outputs);

    this.writer.commit(node, entry.hash);

    return result;
  }
  private async restore(node: DagNode, entry: BuildPlanEntry): Promise<BuildResult> {
    const artifact = this.defaultArtifactProvider.create(node.name, entry.hash);
    const restored = await this.artifactCache.restore(artifact, node.root);

    if (!restored) {
      return this.executeAndCache(node, entry);
    }

    this.writer.commit(node, entry.hash);

    return {
      package: entry.package,
      status: 'skipped',

      changeReason: entry.changeReason,

      execution: {
        reason: 'restored',
      },

      cache: {
        decision: entry.cache.decision,
        action: entry.cache.action,
      },
    };
  }
}
