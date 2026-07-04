// packages/build-core/src/runtime/execution/execution-plan-adapter.ts

import type { GraphQueryService } from '../../graph/graph-query-services.js';
import type { BuildPlan } from '../../planning/build-plan.js';
import { ExecutionPlanBuilder } from '../../planning/execution-dag-compiler.js';
import type { ExecutionPlan } from '../../planning/execution-dag.js';

export class ExecutionPlanAdapter {
  constructor(
    private readonly query: GraphQueryService,
    private readonly plan: BuildPlan,
  ) {}

  build(scope: Set<string>): ExecutionPlan {
    return new ExecutionPlanBuilder(this.query).build({
      plan: this.plan,
      scope,
    });
  }
}
