// packages/build-core/src/application/build-composition-root.ts

import {
  ArtifactPublisherAdapter,
  DefaultArtifactProvider,
  discoverWorkspacePackages,
  FilesystemArtifactCache,
  FilesystemArtifactLayoutFactory,
  FilesystemOutputValidator,
  findWorkspaceRoot,
  NodeAsyncFileSystemAdapter,
  NodeConfigHashService,
  NodeDirectoryHashService,
  NodeFileHashService,
  NodeHashService,
  NodePathService,
  NodeSyncFileSystemAdapter,
} from '@arch/infrastructure';
import type { ArtifactCache, ArtifactProvider, Graph, OutputValidator } from '@arch/platform-model';

import type { BuildExecutor } from '../executor/build-executor.js';
import { ExecutorFactory } from '../executor/executor-factory.js';
import { buildGraph } from '../graph/build-graph.js';
import { GraphQueryService } from '../graph/graph-query-services.js';
import { DagHasher } from '../hash/dag-hasher.js';
import { WorkspaceExecutionContractResolver } from '../planning/workspace-execution-contract-resolver.js';
import type { CommandRunner } from '../public/command-runner.js';
import { BuildService } from '../services/build-service.js';
import { JsonBuildStateLoader } from '../state/json-build-state-loader.js';
import type { BuildState } from '../state/state-types.js';
import { BuildStateWriter } from '../state/state-writer.js';

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
  private readonly fsAsync = new NodeAsyncFileSystemAdapter();
  private readonly fsSync = new NodeSyncFileSystemAdapter();

  private readonly pathService = new NodePathService();

  private readonly hashService = new NodeHashService();
  constructor(private readonly runner: CommandRunner) {}
  async createBuildService(fromDirectory: string): Promise<BuildService> {
    const workspaceRoot = findWorkspaceRoot(fromDirectory);

    const packages = await discoverWorkspacePackages(workspaceRoot);

    const graph = buildGraph(packages);

    const state = this.createBuildStateLoader(workspaceRoot);

    const query = this.createGraphQuery(graph);

    return new BuildService({
      graph,
      query,
      dagHasher: this.createDagHasher(),
      contractResolver: this.createExecutionContractResolver(query),
      state,
      executor: this.createExecutor(),
      artifactCache: this.createArtifactCache(workspaceRoot),
      artifactProvider: this.createArtifactProvider(),
      workspaceRoot,
      fsOutputvalidator: this.createFileSystemOuputValidator(),
      stateWriter: this.createStateWriter(state, workspaceRoot),
    });
  }
  /**
   * Creates the artifact cache implementation used during build execution.
   *
   * @param workspaceRoot Workspace location used to resolve artifact storage paths.
   *
   * @returns An artifact cache implementation backed by the filesystem.
   */
  createArtifactCache(workspaceRoot: string): ArtifactCache {
    const layoutFactory = new FilesystemArtifactLayoutFactory(
      this.pathService.join(workspaceRoot, '.arch-cache', 'artifacts'),
      this.pathService,
    );

    const publisher = new ArtifactPublisherAdapter(this.fsAsync, this.pathService);

    return new FilesystemArtifactCache(layoutFactory, publisher, this.fsAsync, this.pathService);
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
  createBuildStateLoader(workspaceRoot: string): BuildState {
    return new JsonBuildStateLoader(this.fsSync, this.pathService).load(workspaceRoot);
  }
  createStateWriter(state: BuildState, workspaceRoot: string): BuildStateWriter {
    return new BuildStateWriter(state, workspaceRoot, this.fsAsync, this.pathService);
  }
  /**
   * Creates the artifact provider used to generate artifact metadata.
   *
   * @returns An artifact provider implementation.
   */
  createArtifactProvider(): ArtifactProvider {
    return new DefaultArtifactProvider();
  }

  createFileSystemOuputValidator(): OutputValidator {
    return new FilesystemOutputValidator(this.fsAsync, this.pathService);
  }
  createDagHasher(): DagHasher {
    const fileHashService = new NodeFileHashService(this.hashService);

    const directoryHashService = new NodeDirectoryHashService(fileHashService);

    const configHashService = new NodeConfigHashService(this.hashService);

    return new DagHasher(
      directoryHashService,
      configHashService,
      this.hashService,
      this.pathService,
    );
  }
}
