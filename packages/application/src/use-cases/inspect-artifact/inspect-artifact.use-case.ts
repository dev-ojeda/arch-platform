// packages/application/src/use-cases/inspect-artifact/inspect-artifact.use-case.ts

import type { PathService } from '@arch-platform/contracts';
import type {
  ArtifactDistributionPreparedWriter,
  PackageDescriptor,
  PackedReader,
} from '@arch-platform/platform-model';

import { createStopwatch } from '../../helpers/create-stopwatch.js';

import type { InspectResult } from './inspect-result.js';

export interface InspectArtifactInput {
  readonly artifact: string;
}

export class InspectArtifactUseCase {
  constructor(
    private readonly reader: PackedReader,
    private readonly writer: ArtifactDistributionPreparedWriter,
    private readonly artifactsDirectory: string,
    private readonly packages: readonly PackageDescriptor[],
    private readonly pathService: PathService,
  ) {}

  public async execute(input: InspectArtifactInput): Promise<InspectResult> {
    const stopwatch = createStopwatch();

    const packageDescriptor = this.packages.find((item) => item.name === input.artifact);

    if (!packageDescriptor) {
      throw new Error(`Packed artifact "${input.artifact}" was not found`);
    }

    const version = packageDescriptor.manifest.version;

    if (!version) {
      throw new Error(`Package "${input.artifact}" does not have a version`);
    }

    // npm pack names scoped packages as scope-package-version.tgz.
    const fileName = `${packageDescriptor.name.replace(/^@/, '').replace('/', '-')}-${version}.tgz`;

    const artifactPath = this.pathService.join(
      this.artifactsDirectory,
      ...packageDescriptor.name.split('/'),
      version,
      fileName,
    );

    // Función que consume el registry para calcular el hash en base al total de los archivos
    const inspection = await this.reader.read(artifactPath);

    if (
      inspection.package.name !== packageDescriptor.name ||
      inspection.package.version !== version
    ) {
      throw new Error(`Packed artifact identity mismatch for "${input.artifact}@${version}"`);
    }

    this.writer.apply({
      artifactRegistryStatus: inspection.artifactRegistryStatus,
      artifact: inspection.artifact,
      file: inspection.file,
      packageName: inspection.package.name,
      version: inspection.package.version,
      integrityCalculated: inspection.integrity.calculated.length > 0,
      integrityMatches: inspection.integrity.matches,
      integrityResolved: inspection.integrity.expected !== undefined,
    });

    await this.writer.write();

    return {
      success: true,
      durationMs: stopwatch.milliseconds(),
      artifact: input.artifact,
      inspection,
    };
  }
}
