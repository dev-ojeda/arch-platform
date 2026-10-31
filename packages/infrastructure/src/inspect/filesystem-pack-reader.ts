// packages/infrastructure/src/inspect/filesystem-pack-reader.ts

import { createHash } from 'node:crypto';

import type { FileSystemAsyncPort } from '@arch-platform/contracts';
import type {
  PackedArtifactInspect,
  PackedReader,
  PackInspectPort,
  RegistryPublishedVersionsReader,
} from '@arch-platform/platform-model';

import { baseName } from '../filesystem/io/path-utils.js';

export class FilesystemPackReader implements PackedReader {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly packInspect: PackInspectPort,
    private readonly registryReader: RegistryPublishedVersionsReader,
  ) {}

  async read(artifactPath: string): Promise<PackedArtifactInspect> {
    return this.inspectPackedArtifact(artifactPath);
  }

  private async inspectPackedArtifact(artifactPath: string): Promise<PackedArtifactInspect> {
    const fileBuffer = await this.filesystem.readBuffer(artifactPath);

    const hash = createHash('sha512').update(fileBuffer).digest('base64');
    const calculatedIntegrity = `sha512-${hash}`;

    const inspection = await this.packInspect.inspect(fileBuffer);

    const catalog = await this.registryReader.read(inspection.name);

    const publishedPackage =
      catalog?.package.packageName === inspection.name ? catalog.package : undefined;

    const registryVersion = publishedPackage?.versions[inspection.version];
    const expectedIntegrity = registryVersion?.dist?.integrity;

    return Object.freeze({
      artifactRegistryStatus: registryVersion === undefined ? 'not-registered' : 'registered',
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
