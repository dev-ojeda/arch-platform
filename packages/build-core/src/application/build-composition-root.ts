// packages/build-core/src/application/build-composition-root.ts

import type { ArtifactCache } from '../artifact/artifact-cache.js';
import type { ArtifactProvider } from '../artifact/artifact-provider.js';
import { DefaultArtifactProvider } from '../artifact/default-artifact-provider.js';
import { FilesystemArtifactCache } from '../artifact/filesystem-artifact-cache.js';
import { FilesystemArtifactLayoutFactory } from '../artifact/filesystem-artifact-layout-factory.js';
import { FilesystemArtifactPublisher } from '../artifact/publisher/filesystem-artifact-publisher.js';
import type { BuildExecutor } from '../executor/build-executor.js';
import { ExecutorFactory } from '../executor/executor-factory.js';
import { joinPath } from '../fs/path-utils.js';
import type { Graph } from '../graph/dag-types.js';
import { GraphQueryService } from '../graph/graph-query-services.js';
import { WorkspaceExecutionContractResolver } from '../planning/workspace-execution-contract-resolver.js';
import type { CommandRunner } from '../runtime/command-runner.js';
import { JsonBuildStateLoader } from '../state/json-build-state-loader.js';
import type { BuildState } from '../state/state-types.js';

/**
 * Centralizes dependency creation for the build application.
 *
 * The composition root is responsible for creating concrete implementations
 * and assembling the dependencies required by the application layer.
 *
 * Responsibilities:
 * - Create infrastructure components.
 * - Resolve concrete implementations behind application contracts.
 * - Centralize object construction.
 *
 * This class should not contain build execution logic or business rules.
 */
export class BuildCompositionRoot {
  constructor(private readonly runner: CommandRunner) {}

  /**
   * Creates the artifact cache implementation used during build execution.
   *
   * @param workspaceRoot Workspace location used to resolve artifact storage paths.
   *
   * @returns An artifact cache implementation backed by the filesystem.
   */
  createArtifactCache(workspaceRoot: string): ArtifactCache {
    const layoutFactory = new FilesystemArtifactLayoutFactory(
      joinPath(workspaceRoot, '.arch-cache', 'artifacts'),
    );

    const publisher = new FilesystemArtifactPublisher();

    return new FilesystemArtifactCache(layoutFactory, publisher);
  }

  /**
   * Creates the component responsible for executing build commands.
   *
   * @returns A configured build executor.
   */
  createExecutor(): BuildExecutor {
    const executor = new ExecutorFactory();

    return executor.create({
      runner: this.runner,
    });
  }

  /**
   * Creates the graph query service used to inspect package relationships.
   *
   * @param graph Dependency graph used by query operations.
   *
   * @returns A graph query service instance.
   */
  createGraphQuery(graph: Graph): GraphQueryService {
    return new GraphQueryService(graph);
  }

  /**
   * Creates the resolver responsible for determining execution contracts.
   *
   * @param query Graph query service used to resolve workspace information.
   *
   * @returns An execution contract resolver.
   */
  createExecutionContractResolver(query: GraphQueryService): WorkspaceExecutionContractResolver {
    return new WorkspaceExecutionContractResolver(query);
  }

  /**
   * Loads the persisted build state for a workspace.
   *
   * @param workspaceRoot Workspace location containing build state information.
   *
   * @returns The current build state snapshot.
   */
  loadBuildState(workspaceRoot: string): BuildState {
    const loader = new JsonBuildStateLoader();

    return loader.load(workspaceRoot);
  }

  /**
   * Creates the artifact provider used to generate artifact metadata.
   *
   * @returns An artifact provider implementation.
   */
  createArtifactProvider(): ArtifactProvider {
    return new DefaultArtifactProvider();
  }
}
