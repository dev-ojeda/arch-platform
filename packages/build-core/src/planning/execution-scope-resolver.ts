// packages/build-core/src/planning/execution-scope-resolver.ts

import type { GraphEngine } from '../graph/graph-engine.js';

import type { BuildPlan } from './build-plan.js';

export class ExecutionScopeResolver {
  constructor(
    private readonly plan: BuildPlan,
    private readonly engine: GraphEngine,
  ) {}

  resolve(target: string): Set<string> {
    const affected = this.getAffectedNodes();

    const impacted = this.engine.getImpactGraph(affected);

    const dependencies = this.engine.getDependencySubgraph(target);

    const scope = new Set<string>();

    for (const name of dependencies) {
      if (impacted.has(name)) {
        scope.add(name);
      }
    }

    scope.add(target);

    return scope;
  }

  private getAffectedNodes(): Set<string> {
    return new Set(
      [...this.plan.entries()]
        .filter(([, entry]) => this.isAffected(entry.cache.decision))
        .map(([name]) => name),
    );
  }

  private isAffected(decision: string): boolean {
    return (
      decision === 'miss' ||
      decision === 'stale' ||
      decision === 'invalid' ||
      decision === 'restore'
    );
  }
}
