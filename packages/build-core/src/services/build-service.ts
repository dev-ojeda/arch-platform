// packages/build-core/src/services/build-service.ts

import type { ArtifactCache } from '../artifact/artifact-cache.js';
import { FilesystemOutputValidator } from '../artifact/filesystem-output-validator.js';
import { CacheEvaluator } from '../cache/cache-evaluator.js';
import type { BuildExecutor } from '../executor/build-executor.js';
import type { BuildResult } from '../executor/build-result.js';
import { BuildTaskRunner } from '../graph/build-task-runner.js';
import type { Graph } from '../graph/dag-types.js';
import { DependencyResolver } from '../graph/dependency-resolver.js';
import type { GraphEngine } from '../graph/graph-engine.js';
import { GraphRuntimeScheduler } from '../graph/graph-runtime-scheduler.js';
import { RuntimeState } from '../graph/runtime-state.js';
import { DagHasher } from '../hash/dag-hasher.js';
import { HashGraphBuilder } from '../hash/hash-graph.js';
import { LOG_EVENTS } from '../logging/log-events.js';
import { logger } from '../logging/logger.js';
import { ChangePlanner } from '../planning/change-planner.js';
import { ExecutionScopeResolver } from '../planning/execution-scope-resolver.js';
import type { BuildState } from '../state/state-types.js';
import { BuildStateWriter } from '../state/state-writer.js';

import type { BuildServiceSummary } from './build-service-summary.js';

export interface BuildRequest {
  packageName: string;
  concurrency?: number;
}

export interface BuildContext {
  graph: Graph;
  engine: GraphEngine;

  state: BuildState;

  executor: BuildExecutor;

  artifactCache: ArtifactCache;

  workspaceRoot: string;
}

export class BuildService {
  constructor(private context: BuildContext) {}

  async run(request: BuildRequest): Promise<BuildServiceSummary> {
    const { graph, engine, state, executor, artifactCache, workspaceRoot } = this.context;

    const hashes = new HashGraphBuilder(graph, new DagHasher()).build();
    const outputValidator = new FilesystemOutputValidator();
    const cache = new CacheEvaluator(state, outputValidator, artifactCache);

    const planner = new ChangePlanner(cache);

    const plan = await planner.createPlan(graph, hashes);

    const scope = new ExecutionScopeResolver(plan, engine).resolve(request.packageName);

    if (scope.size === 0) {
      return this.summarize([]);
    }

    const runtime = new RuntimeState();

    const resolver = new DependencyResolver(engine, runtime);

    const writer = new BuildStateWriter(state, workspaceRoot);

    const runner = new BuildTaskRunner(
      graph,
      executor,
      plan,
      writer,
      artifactCache,
      outputValidator,
    );

    const scheduler = new GraphRuntimeScheduler(
      runner,
      resolver,
      runtime,
      request.concurrency ?? 4,
    );

    const results = await scheduler.run(scope);
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
