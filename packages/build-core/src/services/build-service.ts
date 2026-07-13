// packages/build-core/src/services/build-service.ts

import { FilesystemOutputValidator } from '../artifact/filesystem-output-validator.js';
import { CacheEvaluator } from '../cache/cache-evaluator.js';
import type { BuildResult } from '../executor/build-result.js';
import { BuildTaskRunner } from '../graph/build-task-runner.js';
import { DagHasher } from '../hash/dag-hasher.js';
import { HashGraphBuilder } from '../hash/hash-graph.js';
import { LOG_EVENTS } from '../logging/log-events.js';
import { logger } from '../logging/logger.js';
import { ChangePlanner } from '../planning/change-planner.js';
import { ExecutionDagCompiler } from '../planning/execution-dag-compiler.js';
import { ScopeResolver } from '../planning/scope-resolver.js';
import { createExecutionContext } from '../runtime/execution/execution-context.js';
import { ExecutionPlanScheduler } from '../runtime/execution/execution-plan-scheduler.js';
import { BuildStateWriter } from '../state/state-writer.js';

import type { BuildContext } from './build-context.js';
import type { BuildOptions } from './build-options.js';
import type { BuildServiceSummary } from './build-service-summary.js';
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
      contractResolver,
      state,
      executor,
      artifactCache,
      artifactProvider,
      workspaceRoot,
    } = this.context;

    // -------------------------
    // 1. HASH
    // -------------------------
    const hashes = new HashGraphBuilder(graph, new DagHasher()).build();

    // -------------------------
    // 2. CACHE
    // -------------------------
    const outputValidator = new FilesystemOutputValidator();
    const cache = new CacheEvaluator(state, outputValidator);

    const planner = new ChangePlanner(cache);
    const buildPlan = planner.createPlan(graph, hashes);

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
    const writer = new BuildStateWriter(state, workspaceRoot);

    const runner = new BuildTaskRunner(
      graph,
      executor,
      buildPlan,
      writer,
      artifactCache,
      outputValidator,
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
      writer.prune(new Set(graph.keys()));

      const changes = writer.getChanges();

      if (!changes.isEmpty) {
        logger.info(LOG_EVENTS.STATE_CHANGED, {
          metadata: changes.summary(),
        });

        await writer.persist();
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
