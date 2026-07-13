// packages/build-core/src/planning/scope-resolver.ts

import type { CacheDecision } from '../cache/cache-types.js';
import type { GraphQueryService } from '../graph/graph-query-services.js';

import type { BuildPlan } from './build-plan.js';
import type { BuildScope } from './build-scope.js';

export class ScopeResolver {
  constructor(
    private readonly plan: BuildPlan,
    private readonly query: GraphQueryService,
  ) {}

  resolve(scope: BuildScope): Set<string> {
    const affected = this.getAffectedNodes();
    switch (scope?.mode) {
      case 'workspace':
        return new Set(affected);
      case 'package':
        return this.query.resolveExecutionScope(scope.packageName, affected);
      default:
        return new Set(affected);
    }
  }

  private getAffectedNodes(): Set<string> {
    const affected = new Set<string>();

    for (const [name, entry] of this.plan.entries()) {
      if (this.isAffected(entry.cache.decision)) {
        affected.add(name);
      }
    }

    return affected;
  }

  private isAffected(decision: CacheDecision): boolean {
    return (
      decision === 'miss' ||
      decision === 'stale' ||
      decision === 'invalid' ||
      decision === 'restore'
    );
  }
}
