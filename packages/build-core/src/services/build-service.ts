// packages/build-core/src/services/build-service.ts

import type { ArtifactCache } from '../artifact/artifact-cache.js';
import { DefaultArtifactProvider } from '../artifact/default-artifact-provider.js';
import { FilesystemOutputValidator } from '../artifact/filesystem-output-validator.js';
import { CacheEvaluator } from '../cache/cache-evaluator.js';
import type { BuildExecutor } from '../executor/build-executor.js';
import type { BuildResult } from '../executor/build-result.js';
import { BuildTaskRunner } from '../graph/build-task-runner.js';
import type { Graph } from '../graph/dag-types.js';
import type { GraphQueryService } from '../graph/graph-query-services.js';
import { DagHasher } from '../hash/dag-hasher.js';
import { HashGraphBuilder } from '../hash/hash-graph.js';
import { LOG_EVENTS } from '../logging/log-events.js';
import { logger } from '../logging/logger.js';
import { ChangePlanner } from '../planning/change-planner.js';
import type { ExecutionContractResolver } from '../planning/execution-contract-resolver.js';
import { ExecutionDagCompiler } from '../planning/execution-dag-compiler.js';
import { ScopeResolver } from '../planning/scope-resolver.js';
import { createExecutionContext } from '../runtime/execution/execution-context.js';
import { ExecutionPlanScheduler } from '../runtime/execution/execution-plan-scheduler.js';
import type { BuildState } from '../state/state-types.js';
import { BuildStateWriter } from '../state/state-writer.js';

import type { BuildServiceSummary } from './build-service-summary.js';

export interface BuildRequest {
  packageName: string;
  concurrency?: number;
}
export interface BuildContext {
  graph: Graph;
  query: GraphQueryService;
  contractResolver: ExecutionContractResolver;
  state: BuildState;
  executor: BuildExecutor;
  artifactCache: ArtifactCache;
  workspaceRoot: string;
}
export class BuildService {
  constructor(private readonly context: BuildContext) {}

  async run(request: BuildRequest): Promise<BuildServiceSummary> {
    const { graph, query, contractResolver, state, executor, artifactCache, workspaceRoot } =
      this.context;

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
    const scope = new ScopeResolver(buildPlan, query).resolve(request.packageName);

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
      new DefaultArtifactProvider(),
    );

    const scheduler = new ExecutionPlanScheduler(runner, request.concurrency ?? 4);
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
