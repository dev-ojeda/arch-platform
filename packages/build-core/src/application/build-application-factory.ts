// packages/build-core/src/application/build-application-factory.ts

import type { ArtifactCache } from '../artifact/artifact-cache.js';
import { FilesystemArtifactCache } from '../artifact/filesystem-artifact-cache.js';
import { FilesystemArtifactPublisher } from '../artifact/publisher/filesystem-artifact-publisher.js';
import { ExecutorFactory } from '../executor/executor-factory.js';
import { joinPath } from '../fs/path-utils.js';
import { buildGraph } from '../graph/build-graph.js';
import { GraphEngine } from '../graph/graph-engine.js';
import type { CommandRunner } from '../runtime/command-runner.js';
import { BuildService } from '../services/build-service.js';
import { loadBuildState } from '../state/state-reader.js';
import { discoverWorkspacePackages } from '../workspace/discover-workspace-packages.js';
import { findWorkspaceRoot } from '../workspace/find-workspace-root.js';

export class BuildApplicationFactory {
  constructor(
    private readonly fromDirectory: string,
    private readonly runner: CommandRunner,
  ) {}

  async create(): Promise<BuildService> {
    const workspaceRoot = findWorkspaceRoot(this.fromDirectory);

    const packages = await discoverWorkspacePackages(workspaceRoot);

    const graph = buildGraph(packages);

    const engine = new GraphEngine(graph);

    const state = loadBuildState(workspaceRoot);

    const artifactCache = this.createArtifactCache(workspaceRoot);

    const executor = new ExecutorFactory().create({
      runner: this.runner,
    });

    return new BuildService({
      graph,
      engine,
      state,
      artifactCache,
      executor,
      workspaceRoot,
    });
  }

  private createArtifactCache(workspaceRoot: string): ArtifactCache {
    const publisher = new FilesystemArtifactPublisher();

    return new FilesystemArtifactCache(
      joinPath(workspaceRoot, '.arch-cache', 'artifacts'),
      publisher,
    );
  }
}
