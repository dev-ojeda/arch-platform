// packages/application/src/use-cases/versioning/version-package.use-case.ts

import { SemanticVersionCalculator } from '@arch-platform/infrastructure';
import type { PackageDescriptor, PackageVersionWriter } from '@arch-platform/platform-model';

import { createStopwatch } from '../../helpers/create-stopwatch.js';

import type { VersionResult } from './version-package-result.js';

interface VersionPackageInput {
  readonly packageName: string;
  readonly releaseType: ReleaseType;
}

type ReleaseType = 'major' | 'minor' | 'patch';

export class VersionPackageUseCase {
  constructor(
    private readonly packageDescriptor: PackageDescriptor,
    private readonly calculator: SemanticVersionCalculator,
    private readonly writer: PackageVersionWriter,
  ) {}

  public async execute(input: VersionPackageInput): Promise<VersionResult> {
    const stopwatch = createStopwatch();
    const currentVersion = this.packageDescriptor.manifest.version;

    if (!currentVersion) {
      throw new Error(`Package "${input.packageName}" does not have a current version`);
    }

    const nextVersion = this.calculator.nextRelease(currentVersion, input.releaseType);

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
