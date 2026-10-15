// packages/application/src/use-cases/registry/sync-registry.use-case.ts

import type {
  RegistryPublishedVersionsAdapterPort,
  RegistryPublishedVersionsReader,
  RegistryPublishedVersionsWriter,
} from '@arch-platform/platform-model';

import { createStopwatch } from '../../helpers/create-stopwatch.js';

import type { SyncRegistryResult } from './sync-registry-result.js';

export interface SyncRegistryInput {
  readonly artifact?: string;
  readonly scope: string;
}

export class SyncRegistryUseCase {
  constructor(
    private readonly adapter: RegistryPublishedVersionsAdapterPort,
    private readonly reader: RegistryPublishedVersionsReader,
    private readonly writer: RegistryPublishedVersionsWriter,
  ) {}

  public async execute(input: SyncRegistryInput): Promise<SyncRegistryResult> {
    const stopwatch = createStopwatch();

    if (input.artifact) {
      const published = await this.adapter.fetchPublishedVersions(input.artifact);

      if (!published) {
        throw new Error(
          `Published versions for "${input.artifact}" were not found in the registry.`,
        );
      }

      this.writer.apply(input.artifact, published);
      await this.writer.write();

      return {
        success: true,
        durationMs: stopwatch.milliseconds(),
        scope: input.scope,
        packagesSynchronized: published.packages.length,
        versionsSynchronized: published.packages.reduce(
          (total, pkg) => total + Object.keys(pkg.versions).length,
          0,
        ),
      };
    }

    const publishedPackages = await this.adapter.fetchPublishedVersionsByScope(input.scope);

    let packagesSynchronized = 0;
    let versionsSynchronized = 0;

    for (const published of publishedPackages) {
      for (const pkg of published.packages) {
        this.writer.apply(pkg.packageName, published);
        packagesSynchronized += 1;
        versionsSynchronized += Object.keys(pkg.versions).length;
      }
    }

    await this.writer.write();

    return {
      success: true,
      durationMs: stopwatch.milliseconds(),
      scope: input.scope,
      packagesSynchronized,
      versionsSynchronized,
    };
  }
}
