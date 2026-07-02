// packages/build-core/src/application/build-composition-root.ts

import type { ArtifactCache } from '../artifact/artifact-cache.js';
import { FilesystemArtifactCache } from '../artifact/filesystem-artifact-cache.js';
import { FilesystemArtifactPublisher } from '../artifact/publisher/filesystem-artifact-publisher.js';
import { ExecutorFactory } from '../executor/executor-factory.js';
import { joinPath } from '../fs/path-utils.js';
import type { Graph } from '../graph/dag-types.js';
import { GraphEngine } from '../graph/graph-engine.js';
import type { CommandRunner } from '../runtime/command-runner.js';

export class BuildCompositionRoot {
  constructor(private readonly runner: CommandRunner) {}

  createArtifactCache(workspaceRoot: string): ArtifactCache {
    const publisher = new FilesystemArtifactPublisher();

    return new FilesystemArtifactCache(
      joinPath(workspaceRoot, '.arch-cache', 'artifacts'),
      publisher,
    );
  }

  createExecutor() {
    return new ExecutorFactory().create({
      runner: this.runner,
    });
  }

  createEngine(graph: Graph) {
    return new GraphEngine(graph);
  }
}
