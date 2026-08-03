// packages/build-core/src/planning/scope-resolver.ts

import type { GraphQueryService } from '../graph/graph-query-services.js';
import type { BuildScope } from '../public/build-scope.js';

import type { BuildPlan } from './build-plan.js';

export class ScopeResolver {
  constructor(
    private readonly plan: BuildPlan,
    private readonly query: GraphQueryService,
  ) {}

  resolve(scope: BuildScope): Set<string> {
    const affected = this.getAffectedNodes();

    switch (scope?.mode) {
      case 'workspace':
        return affected;

      case 'package':
        return this.query.resolveExecutionScope(scope.packageName, affected);

      default:
        return affected;
    }
  }

  private getAffectedNodes(): Set<string> {
    return new Set([...this.plan.entries()].map(([name]) => name));
  }
}
