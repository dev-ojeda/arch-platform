// packages/build-core/src/application/build-application-factory.ts

import { discoverWorkspacePackages } from '../discovery/discover-packages-root.js';
import { buildGraph } from '../graph/build-graph.js';
import type { CommandRunner } from '../runtime/command-runner.js';
import { BuildService } from '../services/build-service.js';
import { loadBuildState } from '../state/state-reader.js';
import { findWorkspaceRoot } from '../workspace/find-workspace-root.js';

import { BuildCompositionRoot } from './build-composition-root.js';

export class BuildApplicationFactory {
  private readonly compositionRoot: BuildCompositionRoot;

  constructor(
    private readonly fromDirectory: string,
    runner: CommandRunner,
  ) {
    this.compositionRoot = new BuildCompositionRoot(runner);
  }

  async create(): Promise<BuildService> {
    const workspaceRoot = findWorkspaceRoot(this.fromDirectory);

    const packages = await discoverWorkspacePackages(workspaceRoot);

    const graph = buildGraph(packages);

    const engine = this.compositionRoot.createEngine(graph);

    const state = loadBuildState(workspaceRoot);

    const artifactCache = this.compositionRoot.createArtifactCache(workspaceRoot);

    const executor = this.compositionRoot.createExecutor();

    return new BuildService({
      graph,
      engine,
      state,
      artifactCache,
      executor,
      workspaceRoot,
    });
  }
}
