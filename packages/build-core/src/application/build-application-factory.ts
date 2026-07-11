// packages/build-core/src/application/build-application-factory.ts

import { discoverWorkspacePackages } from '../discovery/discover-packages-root.js';
import { buildGraph } from '../graph/build-graph.js';
import type { CommandRunner } from '../runtime/command-runner.js';
import { BuildService } from '../services/build-service.js';
import { findWorkspaceRoot } from '../workspace/find-workspace-root.js';

import { BuildCompositionRoot } from './build-composition-root.js';

/**
 * Factory responsible for creating the build application.
 *
 * Coordinates workspace discovery, graph construction, and dependency
 * composition required to create a BuildService instance.
 *
 * This class should only orchestrate application creation and must not
 * contain build execution logic.
 */
export class BuildApplicationFactory {
  private readonly compositionRoot: BuildCompositionRoot;

  constructor(
    private readonly fromDirectory: string,
    runner: CommandRunner,
  ) {
    this.compositionRoot = new BuildCompositionRoot(runner);
  }
  /**
   * Creates a fully configured BuildService instance.
   *
   * The creation flow follows:
   * workspace resolution -> package discovery -> graph creation ->
   * dependency composition.
   *
   * @returns A BuildService instance ready to execute build operations.
   */
  async create(): Promise<BuildService> {
    const workspaceRoot = findWorkspaceRoot(this.fromDirectory);

    const packages = await discoverWorkspacePackages(workspaceRoot);

    const graph = buildGraph(packages);

    // Domain services
    const query = this.compositionRoot.createGraphQuery(graph);

    const contractResolver = this.compositionRoot.createExecutionContractResolver(query);

    // State
    const state = this.compositionRoot.loadBuildState(workspaceRoot);

    // Runtime dependencies
    const executor = this.compositionRoot.createExecutor();

    const artifactCache = this.compositionRoot.createArtifactCache(workspaceRoot);

    const artifactProvider = this.compositionRoot.createArtifactProvider();

    return new BuildService({
      graph,
      query,
      contractResolver,
      state,
      executor,
      artifactCache,
      artifactProvider,
      workspaceRoot,
    });
  }
}
