// packages/build-core/src/artifact/default-artifact-state-builder.ts

import type {
  ArtifactState,
  ArtifactStateReason,
  ArtifactStateStatus,
  Graph,
} from '@arch-platform/platform-model';

import type { ArtifactStateBuilder } from './artifact-state-builder.js';
import type { BuildResult } from '../executor/build-result.js';
import { BuildPlan } from '../planning/build-plan.js';
import type { BuildPlanEntry } from '../planning/plan-entry.js';
import type { ExecutionContext } from '../runtime/execution/execution-context.js';


export class DefaultArtifactStateBuilder implements ArtifactStateBuilder {
  build(
    graph: Graph,
    plan: BuildPlan,
    results: readonly BuildResult[],
    context: ExecutionContext,
  ): ReadonlyMap<string, ArtifactState> {
    const artifacts = new Map<string, ArtifactState>();

    for (const result of results) {
      if (result.status === 'failed' || result.execution.reason === 'failed') {
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
        dependencies: [...node.dependencies],
        artifactType: node.artifactType,
        status: this.resolveStatus(result),
        reason: this.resolveReason(entry),
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

  private resolveReason(entry: BuildPlanEntry): ArtifactStateReason {
    switch (entry.changeReason) {
      case 'none':
        return 'none';

      case 'first-build':
        return 'first-build';

      case 'source':
        return 'source-changed';

      case 'config':
        return 'config-changed';

      case 'dependency':
        return 'dependency-changed';

      case 'cache-version':
        return 'cache-version-changed';

      case 'output-integrity':
        return 'output-integrity-failed';

      case 'missing-output':
        return 'missing-output';

      case 'dependency-failed':
        throw new Error('Cannot create ArtifactState for a dependency-failed change');
    }
  }
}
