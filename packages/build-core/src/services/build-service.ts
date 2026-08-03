// packages/build-core/src/services/build-service.ts

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
 *
 * The service coordinates these stages but delegates implementation details
 * to specialized components.
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
      fsOutputvalidator,
      stateWriter,
    } = this.context;

    // -------------------------
    // 1. HASH
    // -------------------------
    const hashes = new HashGraphBuilder(graph, dagHasher).build();

    // -------------------------
    // 2. CACHE
    // -------------------------
    const cache = new CacheEvaluator(state, fsOutputvalidator);

    const planner = new ChangePlanner(cache);
    const buildPlan = await planner.createPlan(graph, hashes);

    // -------------------------
    // 3. SCOPE (SIN ENGINE)
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
      fsOutputvalidator,
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

      if (!changes.isEmpty) {
        logger.info(LOG_EVENTS.STATE_CHANGED, {
          metadata: changes.summary(),
        });

        await stateWriter.write();
      }
    }

    return this.summarize(results);
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
}
