// packages/application/src/use-cases/inspect-artifact/inspect-artifact.use-case.ts
import type {
  ArtifactDistributionPreparedWriter,
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
  ) {}

  public async execute(input: InspectArtifactInput): Promise<InspectResult> {
    const stopwatch = createStopwatch();

    const inspections = await this.reader.read(this.artifactsDirectory);

    const inspection = inspections.find((item) => item.package.name === input.artifact);

    if (!inspection) {
      throw new Error(`Packed artifact "${input.artifact}" was not found`);
    }

    const prepared = {
      artifactRegistryStatus: inspection.artifactRegistryStatus,
      artifact: inspection.artifact,
      file: inspection.file,
      packageName: inspection.package.name,
      version: inspection.package.version,
      integrityCalculated: inspection.integrity.calculated.length > 0,
      integrityMatches: inspection.integrity.matches,
      integrityResolved: inspection.integrity.expected !== undefined,
    };
    this.writer.apply(prepared);
    await this.writer.write();

    return {
      success: true,
      durationMs: stopwatch.milliseconds(),
      artifact: input.artifact,
      inspection,
    };
  }
}
