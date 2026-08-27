// packages/build-core/src/artifact/artifact-state-builder.ts

import type { ArtifactState, ArtifactStateStatus, Graph } from '@arch/platform-model';

import type { BuildResult } from '../executor/build-result.js';
import { BuildPlan } from '../planning/build-plan.js';
import type { ExecutionContext } from '../runtime/execution/execution-context.js';

export class ArtifactStateBuilder {
  build(
    graph: Graph,
    plan: BuildPlan,
    results: readonly BuildResult[],
    context: ExecutionContext,
  ): ReadonlyMap<string, ArtifactState> {
    const artifacts = new Map<string, ArtifactState>();

    for (const result of results) {
      if (result.status === 'failed' || result.status === 'skipped') {
        continue;
      }

      const node = graph.get(result.package);
      const entry = plan.get(result.package);
      const trace = context.nodes.get(result.package);

      if (!node || !entry || !trace) {
        continue;
      }

      if (trace.startedAt === undefined || trace.finishedAt === undefined) {
        continue;
      }

      artifacts.set(result.package, {
        hash: entry.hash,
        dependencies: node.dependencies,
        status: this.resolveStatus(result),
        startedAt: trace.startedAt,
        finishedAt: trace.finishedAt,
        schemaVersion: 1,
      });
    }

    return artifacts;
  }

  private resolveStatus(result: BuildResult): ArtifactStateStatus {
    switch (result.execution.reason) {
      case 'executed':
        return 'built';

      case 'restored':
        return 'restored';

      case 'cached':
        return 'cached';

      default:
        throw new Error(
          `Cannot create ArtifactState for execution reason "${result.execution.reason}"`,
        );
    }
  }
}
