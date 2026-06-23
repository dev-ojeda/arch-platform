// packages/build-core/src/application/build-application-factory.ts

import { FilesystemArtifactCache } from '../artifact/filesystem-artifact-cache.js';
import { createBuildSteps } from '../executor/build-step-factory.js';
import { ExecutorFactory } from '../executor/executor-factory.js';
import { joinPath } from '../fs/path-utils.js';
import { buildGraph } from '../graph/build-graph.js';
import { GraphEngine } from '../graph/graph-engine.js';
import type { CommandRunner } from '../runtime/command-runner.js';
import { BuildService } from '../services/build-service.js';
import { loadBuildState } from '../state/state-reader.js';
import { discoverWorkspacePackages } from '../workspace/discover-workspace-packages.js';

export class BuildApplicationFactory {
  constructor(
    private readonly workspaceRoot: string,
    private readonly runner: CommandRunner,
  ) {}

  async create(): Promise<BuildService> {
    const packages = await discoverWorkspacePackages(this.workspaceRoot);

    const graph = buildGraph(packages);

    const engine = new GraphEngine(graph);

    const state = loadBuildState(this.workspaceRoot);

    const artifactCache = new FilesystemArtifactCache(
      joinPath(this.workspaceRoot, '.arch-cache', 'artifacts'),
    );

    const steps = createBuildSteps();

    const executor = new ExecutorFactory().create({
      runner: this.runner,
      steps,
    });
    return new BuildService({
      graph,
      engine,
      state,
      artifactCache,
      executor,
      workspaceRoot: this.workspaceRoot,
    });
  }
}
