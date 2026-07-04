// packages/build-core/src/planning/change-planner.ts

import type { CacheEvaluator } from '../cache/cache-evaluator.js';
import type { Graph } from '../graph/dag-types.js';
import type { HashResult } from '../hash/hash-result.js';
import { logger } from '../logging/logger.js';

import { BuildPlan } from './build-plan.js';

export class ChangePlanner {
  constructor(private evaluator: CacheEvaluator) {}

  createPlan(graph: Graph, hashes: Map<string, HashResult>): BuildPlan {
    const plan = new BuildPlan();

    for (const [name, node] of graph) {
      const hash = hashes.get(name);

      if (!hash) {
        throw new Error(`[ChangePlanner] Missing hash for "${name}"`);
      }

      const evaluation = this.evaluator.evaluate(
        node.name,
        node.root,
        node.outputs,
        node.dependencies,
        hash,
      );

      plan.set(name, {
        package: name,

        shouldExecute:
          evaluation.decision === 'miss' ||
          evaluation.decision === 'stale' ||
          evaluation.decision === 'invalid',
        execution: {
          reason: 'cached',
        },
        cache: {
          decision: evaluation.decision,
          action: evaluation.decision === 'restore' ? 'restore' : 'none',
        },

        changeReason: evaluation.changeReason,

        hash,
      });

      logger.trace('build.plan', {
        metadata: {
          package: name,
          hash: hash.hash,
          changeReason: evaluation.changeReason,
          cacheDecision: evaluation.decision,
        },
      });
    }

    return plan;
  }
}
