// packages/build-core/src/planning/change-planner.ts

import type { CacheEvaluator } from '../cache/cache-evaluator.js';
import type { Graph } from '../graph/dag-types.js';
import type { HashResult } from '../hash/hash-result.js';

import { BuildPlan } from './build-plan.js';

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

        shouldExecute: evaluation.decision !== 'hit' && evaluation.decision !== 'restore',

        cacheDecision: evaluation.decision,

        changeReason: evaluation.changeReason,

        executionReason:
          evaluation.decision === 'hit'
            ? 'cached'
            : evaluation.decision === 'restore'
              ? 'artifact-restored'
              : 'scheduled',

        hash,
      });
    }

    return plan;
  }
}
