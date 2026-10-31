// packages/application/src/use-cases/versioning/version-package.use-case.ts

import { SemanticVersionCalculator } from '@arch-platform/infrastructure';
import type {
  PackageDescriptor,
  PackageVersionWriter,
  RegistryPublishedVersionsReader,
} from '@arch-platform/platform-model';

import { createStopwatch } from '../../helpers/create-stopwatch.js';

import type { VersionResult } from './version-package-result.js';

interface VersionPackageInput {
  readonly packageName: string;
  readonly releaseType: ReleaseType;
  readonly tagName?: string;
}

type ReleaseType =
  | 'major'
  | 'minor'
  | 'patch'
  | 'prerelease'
  | 'premajor'
  | 'preminor'
  | 'prepatch';

export class VersionPackageUseCase {
  constructor(
    private readonly packageDescriptor: PackageDescriptor,
    private readonly calculator: SemanticVersionCalculator,
    private readonly writer: PackageVersionWriter,
    private readonly registryReader: RegistryPublishedVersionsReader,
  ) {}

  public async execute(input: VersionPackageInput): Promise<VersionResult> {
    const stopwatch = createStopwatch();
    const currentVersion = this.packageDescriptor.manifest.version;

    if (!currentVersion) {
      throw new Error(`Package "${input.packageName}" does not have a current version`);
    }

    const registryState = await this.registryReader.read(input.packageName);

    const latestStablePublishedVersion = this.calculator.getLatestStable(
      Object.keys(registryState?.package?.versions ?? {}),
    );

    const baseVersion =
      latestStablePublishedVersion &&
      this.calculator.compare(latestStablePublishedVersion, currentVersion) > 0
        ? latestStablePublishedVersion
        : currentVersion;

    const nextVersion = this.calculator.nextRelease(baseVersion, input.releaseType, input.tagName);

    await this.writer.write(this.packageDescriptor.manifestPath, nextVersion);

    return {
      success: true,
      durationMs: stopwatch.milliseconds(),
      artifact: input.packageName,
      releaseType: input.releaseType,
      currentVersion,
      nextVersion,
    };
  }
}
