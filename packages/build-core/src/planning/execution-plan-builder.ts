// packages/build-core/src/planning/execution-plan-builder.ts

import type { GraphQueryService } from '../graph/graph-query-services.js';

import type { BuildPlan } from './build-plan.js';
import type { ExecutionNode, ExecutionPlan } from './execution-plan.js';

type ExecutionPlanBuilderInput = {
  plan: BuildPlan;
  scope: Set<string>;
};

export class ExecutionPlanBuilder {
  constructor(private readonly query: GraphQueryService) {}

  build(input: ExecutionPlanBuilderInput): ExecutionPlan {
    const { plan, scope } = input;

    const nodes = new Map<string, ExecutionNode>();

    // 1. build nodes
    for (const name of scope) {
      const entry = plan.get(name);
      if (!entry) continue;

      const dependencies = this.query.getDependencies(name).filter((d) => scope.has(d));

      nodes.set(name, {
        name,
        dependencies,
        dependents: [],
        shouldRun: entry.cache.decision !== 'hit',
        cacheDecision: entry.cache.decision,
        depsRemaining: dependencies.length,
        ready: true,
      });
    }

    // 2. link dependents
    for (const node of nodes.values()) {
      for (const dep of node.dependents) {
        const depNode = nodes.get(dep);
        if (depNode) {
          depNode.dependents.push(node.name);
        }
      }
    }

    return { nodes };
  }
}
