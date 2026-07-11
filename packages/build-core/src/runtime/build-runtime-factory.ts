// packages/build-core/src/runtime/build-runtime-factory.ts

import type { ArtifactCache } from '../artifact/artifact-cache.js';
import { DefaultArtifactProvider } from '../artifact/default-artifact-provider.js';
import { FilesystemOutputValidator } from '../artifact/filesystem-output-validator.js';
import type { BuildExecutor } from '../executor/build-executor.js';
import { BuildTaskRunner } from '../graph/build-task-runner.js';
import type { Graph } from '../graph/dag-types.js';
import type { BuildPlan } from '../planning/build-plan.js';
import type { BuildState } from '../state/state-types.js';
import { BuildStateWriter } from '../state/state-writer.js';

import { ExecutionPlanScheduler } from './execution/execution-plan-scheduler.js';

export class BuildRuntimeFactory {
  constructor(
    private readonly executor: BuildExecutor,
    private readonly artifactCache: ArtifactCache,
    private readonly workspaceRoot: string,
  ) {}

  create(graph: Graph, state: BuildState, buildPlan: BuildPlan, concurrency: number) {
    const outputValidator = new FilesystemOutputValidator();

    const writer = new BuildStateWriter(state, this.workspaceRoot);

    const runner = new BuildTaskRunner(
      graph,
      this.executor,
      buildPlan,
      writer,
      this.artifactCache,
      outputValidator,
      new DefaultArtifactProvider(),
    );

    return new ExecutionPlanScheduler(runner, concurrency);
  }
}
