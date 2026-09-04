// packages/build-core/src/services/build-service.ts

import type { ArtifactState, ArtifactStateHistory } from '@arch/platform-model';

import { CacheEvaluator } from '../cache/cache-evaluator.js';
import type { BuildResult } from '../executor/build-result.js';
import { BuildTaskRunner } from '../graph/build-task-runner.js';
import { HashGraphBuilder } from '../hash/hash-graph.js';
import { LOG_EVENTS } from '../logging/log-events.js';
import { logger } from '../logging/logger.js';
import { ChangePlanner } from '../planning/change-planner.js';
import { ExecutionDagCompiler } from '../planning/execution-dag-compiler.js';
import { ScopeResolver } from '../planning/scope-resolver.js';
import type { BuildServiceSummary } from '../public/build-service-summary.js';
import { createExecutionContext } from '../runtime/execution/execution-context.js';
import { ExecutionPlanScheduler } from '../runtime/execution/execution-plan-scheduler.js';

import type { BuildContext } from './build-context.js';
import type { BuildOptions } from './build-options.js';

/**
 * Application service responsible for orchestrating the build pipeline.
 *
 * Pipeline stages:
 *
 * 1. Hash calculation
 * 2. Cache evaluation
 * 3. Change planning
 * 4. Build scope resolution
 * 5. Execution plan compilation
 * 6. Task execution
 * 7. State persistence
 */
export class BuildService {
  constructor(private readonly context: BuildContext) {}

  async run(options: BuildOptions): Promise<BuildServiceSummary> {
    const {
      graph,
      query,
      dagHasher,
      contractResolver,
      state,
      executor,
      artifactCache,
      artifactProvider,
      fsOutputValidator,
      stateWriter,
      artifactStateReader,
      artifactStateWriter,
      artifactStateHistoryReader,
      artifactStateHistoryWriter,
      artifactStateBuilder,
      workspaceRoot,
    } = this.context;

    // -------------------------
    // 1. HASH
    // -------------------------
    const hashes = new HashGraphBuilder(graph, dagHasher).build();

    // -------------------------
    // 2. CACHE
    // -------------------------

    const cache = new CacheEvaluator(
      state,
      fsOutputValidator,
      query,
      artifactCache,
      artifactProvider,
    );

    const planner = new ChangePlanner(cache);
    const buildPlan = await planner.createPlan(graph, hashes);

    // -------------------------
    // 3. SCOPE
    // -------------------------
    const scope = new ScopeResolver(buildPlan, query).resolve(options.scope);

    if (scope.size === 0) {
      return this.summarize([]);
    }

    // -------------------------
    // 4. EXECUTION PLAN
    // -------------------------
    const executionPlan = new ExecutionDagCompiler(query, contractResolver).compile({
      plan: buildPlan,
      scope,
    });

    // -------------------------
    // 5. RUNTIME
    // -------------------------
    const runner = new BuildTaskRunner(
      graph,
      executor,
      buildPlan,
      stateWriter,
      artifactCache,
      fsOutputValidator,
      artifactProvider,
    );

    const scheduler = new ExecutionPlanScheduler(runner, options.concurrency ?? 4);

    const ctx = createExecutionContext(executionPlan);

    const results = await scheduler.run(executionPlan, ctx);

    // -------------------------
    // 6. STATE PERSISTENCE
    // -------------------------
    const successful = results.every((r) => r.status !== 'failed');

    if (successful) {
      stateWriter.prune(new Set(graph.keys()));

      const changes = stateWriter.getChanges();

      const hasChanges =
        changes.created.size > 0 || changes.updated.size > 0 || changes.deleted.size > 0;

      if (hasChanges) {
        logger.info(LOG_EVENTS.STATE_CHANGED, {
          metadata: {
            created: changes.created.size,
            updated: changes.updated.size,
            deleted: changes.deleted.size,
          },
        });

        await stateWriter.write();
      }

      const artifactStates = artifactStateBuilder.build(graph, buildPlan, results, ctx);

      if (artifactStates.size > 0) {
        const persistedArtifactStates = await artifactStateReader.read(workspaceRoot);

        const historyChanges = this.buildArtifactStateHistory(
          persistedArtifactStates,
          artifactStates,
        );

        if (historyChanges.size > 0) {
          const persistedHistory = await artifactStateHistoryReader.read(workspaceRoot);

          const mergedHistory = this.mergeArtifactStateHistory(persistedHistory, historyChanges);

          await artifactStateHistoryWriter.write(workspaceRoot, mergedHistory);
        }

        const mergedArtifactStates = this.mergeArtifactStates(
          persistedArtifactStates,
          artifactStates,
        );

        await artifactStateWriter.write(workspaceRoot, mergedArtifactStates);
      }
    }

    return this.summarize(results);
  }

  private mergeArtifactStates(
    persisted: ReadonlyMap<string, ArtifactState>,
    current: ReadonlyMap<string, ArtifactState>,
  ): ReadonlyMap<string, ArtifactState> {
    const merged = new Map(persisted);

    for (const [artifact, state] of current) {
      merged.set(artifact, state);
    }

    return merged;
  }
  private mergeArtifactStateHistory(
    persisted: ReadonlyMap<string, ArtifactStateHistory>,
    current: ReadonlyMap<string, ArtifactStateHistory>,
  ): ReadonlyMap<string, ArtifactStateHistory> {
    const merged = new Map(persisted);

    for (const [artifact, currentHistory] of current) {
      const previousHistory = merged.get(artifact);

      if (!previousHistory) {
        merged.set(artifact, currentHistory);
        continue;
      }

      merged.set(artifact, {
        artifact,
        changes: [...previousHistory.changes, ...currentHistory.changes],
      });
    }

    return merged;
  }
  private summarize(results: BuildResult[]): BuildServiceSummary {
    return {
      results,
      executed: results.filter((r) => r.execution.reason === 'executed').length,
      restored: results.filter((r) => r.execution.reason === 'restored').length,
      cached: results.filter((r) => r.execution.reason === 'cached').length,
      failed: results.filter((r) => r.status === 'failed').length,
    };
  }
  private buildArtifactStateHistory(
    previous: ReadonlyMap<string, ArtifactState>,
    current: ReadonlyMap<string, ArtifactState>,
  ): ReadonlyMap<string, ArtifactStateHistory> {
    const history = new Map<string, ArtifactStateHistory>();

    for (const [artifact, currentState] of current) {
      const previousState = previous.get(artifact);

      if (!previousState) {
        history.set(artifact, {
          artifact,
          changes: [
            {
              previousHash: null,
              currentHash: currentState.hash.hash,
              reason: currentState.reason,
              timestamp: currentState.finishedAt,
            },
          ],
        });

        continue;
      }

      if (previousState.hash.hash === currentState.hash.hash) {
        continue;
      }

      history.set(artifact, {
        artifact,
        changes: [
          {
            previousHash: previousState.hash.hash,
            currentHash: currentState.hash.hash,
            reason: currentState.reason,
            timestamp: currentState.finishedAt,
          },
        ],
      });
    }

    return history;
  }
}
