// packages/build-core/src/public/build-application-factory.ts

import { BuildCompositionRoot } from '../application/build-composition-root.js';
import { BuildService } from '../services/build-service.js';

import type { CommandRunner } from './command-runner.js';

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
    return this.compositionRoot.createBuildService(this.fromDirectory);
  }
}
