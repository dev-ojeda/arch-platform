// packages/build-core/src/planning/change-planner.ts

import type { Graph, HashResult } from '@arch/platform-model';

import { CacheEvaluator } from '../cache/cache-evaluator.js';
import type { CacheDecision } from '../cache/cache-types.js';

import { BuildPlan } from './build-plan.js';
import type { BuildAction } from './plan-entry.js';

export class ChangePlanner {
  constructor(private evaluator: CacheEvaluator) {}

  async createPlan(graph: Graph, hashes: Map<string, HashResult>): Promise<BuildPlan> {
    const plan = new BuildPlan();

    for (const [name, node] of graph) {
      const hash = hashes.get(name);

      if (!hash) {
        throw new Error(`[ChangePlanner] Missing hash for "${name}"`);
      }

      const evaluation = await this.evaluator.evaluate(
        node.name,
        node.root,
        node.outputs,
        node.dependencies,
        hash,
      );

      plan.set(name, {
        package: name,

        buildAction: this.resolveBuildAction(evaluation.decision),

        cache: {
          decision: evaluation.decision,
        },
        changeReason: evaluation.changeReason,

        hash,
      });
    }

    return plan;
  }
  private resolveBuildAction(decision: CacheDecision): BuildAction {
    switch (decision) {
      case 'restore':
        return 'restore';

      case 'hit':
        return 'skip';

      case 'miss':
      case 'stale':
      case 'invalid':
        return 'execute';
    }
  }
}
