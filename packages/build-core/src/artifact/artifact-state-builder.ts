// packages/build-core/src/artifact/artifact-state-builder.ts

import type { ArtifactState, Graph } from '@arch/platform-model';

import type { BuildResult } from '../executor/build-result.js';
import { BuildPlan } from '../planning/build-plan.js';
import type { ExecutionContext } from '../runtime/index.js';

export interface ArtifactStateBuilder {
  build(
    graph: Graph,
    plan: BuildPlan,
    results: readonly BuildResult[],
    context: ExecutionContext,
  ): ReadonlyMap<string, ArtifactState>;
}
