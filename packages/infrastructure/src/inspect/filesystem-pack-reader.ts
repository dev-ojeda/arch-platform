// packages/infrastructure/src/inspect/filesystem-pack-reader.ts

import { createHash } from 'node:crypto';

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  ArtifactRegistryPublishingReader,
  PackedArtifactInspect,
  PackedReader,
  PackInspectPort,
} from '@arch-platform/platform-model';

import { baseName, joinPath } from '../filesystem/io/path-utils.js';

export class FilesystemPackReader implements PackedReader {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly packInspect: PackInspectPort,
    private readonly registryReader: ArtifactRegistryPublishingReader,
  ) {}

  async read(packPath: string): Promise<readonly PackedArtifactInspect[]> {
    const directory = await this.filesystem.readDirectory(packPath);

    const artifacts = directory.filter((entry) => entry.isFile && entry.name.endsWith('.tgz'));

    const inspections: PackedArtifactInspect[] = [];

    for (const artifact of artifacts) {
      const artifactPath = joinPath(packPath, artifact.name);
      inspections.push(await this.inspectPackedArtifact(artifactPath));
    }

    return inspections;
  }

  private async inspectPackedArtifact(artifactPath: string): Promise<PackedArtifactInspect> {
    const fileBuffer = await this.filesystem.readBuffer(artifactPath);

    const hash = createHash('sha512').update(fileBuffer).digest('base64');
    const calculatedIntegrity = `sha512-${hash}`;

    const inspection = await this.packInspect.inspect(fileBuffer);

    const registryArtifact = await this.registryReader.find(inspection.name, inspection.version);

    const expectedIntegrity = registryArtifact?.integrity;

    return Object.freeze({
      artifactRegistryStatus: registryArtifact === undefined ? 'not-registered' : 'registered',
      artifact: baseName(artifactPath),
      file: artifactPath,
      size: fileBuffer.byteLength,
      package: inspection,
      integrity: Object.freeze({
        calculated: calculatedIntegrity,
        expected: expectedIntegrity,
        matches:
          expectedIntegrity === undefined ? undefined : calculatedIntegrity === expectedIntegrity,
      }),
    });
  }
}
