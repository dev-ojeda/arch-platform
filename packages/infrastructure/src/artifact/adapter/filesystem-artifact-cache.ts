// packages/infrastructure/src/artifact/adapter/filesystem-artifact-cache.ts

import type { FileSystemAsyncPort, PathService } from '@arch-platform/contracts';
import type {
  Artifact,
  ArtifactCache,
  ArtifactLayoutFactory,
  ArtifactManifest,
  ArtifactOutputComparatorPort,
  ArtifactOutputFingerprinterPort,
  ArtifactPublisher,
  OutputFingerprint,
} from '@arch-platform/platform-model';

import { loggerFactory } from '../../logging/logger.js';
import { ARTIFACT_SCHEMA_VERSION } from '../artifact-schema-version.js';

export class FilesystemArtifactCache implements ArtifactCache {
  logger = loggerFactory.createLogger({
    component: 'FilesystemArtifactCache',
  });
  constructor(
    private readonly layoutFactory: ArtifactLayoutFactory,
    private readonly publisher: ArtifactPublisher,
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
    private readonly fingerprinter: ArtifactOutputFingerprinterPort,
    private readonly comparator: ArtifactOutputComparatorPort,
  ) {}
  async save(artifact: Artifact, root: string, outputs: readonly string[]): Promise<void> {
    const layout = this.layoutFactory.create(artifact);
    const outputFingerprint = await this.fingerprinter.fingerprint(root, outputs);

    const manifest: ArtifactManifest = {
      artifact,
      outputs,
      outputFingerprint,
      createdAt: Date.now(),
      schemaVersion: ARTIFACT_SCHEMA_VERSION,
    };

    await this.publisher.publish(root, manifest, layout);
  }

  async exists(artifact: Artifact): Promise<boolean> {
    const layout = this.layoutFactory.create(artifact);

    try {
      const manifest = await this.loadArtifactManifest(layout.manifest());

      if (!manifest || !this.hasValidFingerprints(manifest)) {
        return false;
      }

      // La caché solo existe a efectos de restauración si su contenido
      // coincide con las huellas publicadas.
      return await this.matchesFingerprints(layout.root, manifest);
    } catch (error) {
      this.logger.error('artifact.cache.exists.failed', {
        metadata: {
          artifact: artifact.id,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      return false;
    }
  }

  async verifyOutputs(artifact: Artifact, root: string): Promise<boolean> {
    const layout = this.layoutFactory.create(artifact);

    try {
      const manifest = await this.loadArtifactManifest(layout.manifest());

      if (!manifest || !this.hasValidFingerprints(manifest)) {
        return false;
      }

      return await this.matchesFingerprints(root, manifest);
    } catch {
      return false;
    }
  }

  async restore(artifact: Artifact, root: string): Promise<boolean> {
    const layout = this.layoutFactory.create(artifact);

    try {
      const manifest = await this.loadArtifactManifest(layout.manifest());

      if (!manifest || !this.hasValidFingerprints(manifest)) {
        return false;
      }

      // No tocar el workspace si la copia almacenada está corrupta.
      if (!(await this.matchesFingerprints(layout.root, manifest))) {
        return false;
      }

      for (const output of manifest.outputs) {
        const source = layout.output(output);
        const destination = this.pathService.join(root, output);

        await this.filesystem.remove(destination);
        await this.filesystem.copy(source, destination);
      }

      // Confirmar que la restauración produjo exactamente los outputs
      // registrados en el manifiesto.
      return await this.matchesFingerprints(root, manifest);
    } catch (error) {
      this.logger.error('artifact.restore.failed', {
        metadata: {
          method: 'async restore',
          artifact: artifact.id,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      return false;
    }
  }

  private hasValidFingerprints(manifest: ArtifactManifest): boolean {
    const fingerprints: readonly OutputFingerprint[] | undefined = manifest.outputFingerprint;

    if (!fingerprints || fingerprints.length !== manifest.outputs.length) {
      return false;
    }

    const outputPaths = new Set(manifest.outputs);

    if (outputPaths.size !== manifest.outputs.length) {
      return false;
    }

    const fingerprintPaths = new Set<string>();

    for (const fingerprint of fingerprints) {
      if (
        !fingerprint ||
        typeof fingerprint.path !== 'string' ||
        !outputPaths.has(fingerprint.path) ||
        fingerprintPaths.has(fingerprint.path) ||
        !Number.isSafeInteger(fingerprint.sizeInBytes) ||
        fingerprint.sizeInBytes < 0 ||
        typeof fingerprint.integrity !== 'string' ||
        !/^sha256:[a-f0-9]{64}$/.test(fingerprint.integrity)
      ) {
        return false;
      }

      fingerprintPaths.add(fingerprint.path);
    }

    return fingerprintPaths.size === outputPaths.size;
  }

  private async matchesFingerprints(root: string, manifest: ArtifactManifest): Promise<boolean> {
    const expected = manifest.outputFingerprint;

    if (!expected) {
      this.logger.error('artifact.cache.fingerprint.missing', {
        metadata: {
          artifact: manifest.artifact.id,
          root,
        },
      });

      return false;
    }

    const actual = await this.fingerprinter.fingerprint(root, manifest.outputs);

    if (actual.length !== manifest.outputs.length) {
      this.logger.error('artifact.cache.fingerprint.count-mismatch', {
        metadata: {
          artifact: manifest.artifact.id,
          root,
          expectedCount: manifest.outputs.length,
          actualCount: actual.length,
          expected,
          actual,
        },
      });

      return false;
    }

    const comparison = this.comparator.compare(expected, actual);

    if (!comparison.isIdentical) {
      this.logger.error('artifact.cache.fingerprint.mismatch', {
        metadata: {
          artifact: manifest.artifact.id,
          root,
          expected,
          actual,
          diff: comparison.diff,
        },
      });
    }

    return comparison.isIdentical;
  }

  private async loadArtifactManifest(filePath: string): Promise<ArtifactManifest | undefined> {
    if (!(await this.filesystem.exists(filePath))) {
      return undefined;
    }

    const value = await this.filesystem.readJson<unknown>(filePath);

    return this.isArtifactManifest(value) ? value : undefined;
  }

  private isArtifact(value: unknown): value is Artifact {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const record = value as Record<string, unknown>;

    return typeof record.packageName === 'string' && typeof record.id === 'string';
  }

  private isArtifactManifest(value: unknown): value is ArtifactManifest {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const record = value as Record<string, unknown>;

    return (
      this.isArtifact(record.artifact) &&
      Array.isArray(record.outputs) &&
      record.outputs.every((output) => typeof output === 'string') &&
      typeof record.createdAt === 'number' &&
      record.schemaVersion === ARTIFACT_SCHEMA_VERSION
    );
  }
}
