// packages\infrastructure\test\__tests__\artifact\filesystem-artifact-cache.test.ts

import { describe, expect, it, vi } from 'vitest';

import { ArtifactOutputComparator } from '../../../src/artifact/adapter/artifact-output-comparator.js';
import { ArtifactOutputFingerprinter } from '../../../src/artifact/adapter/artifact-output-fingerprinter.js';
import { FilesystemArtifactCache } from '../../../src/artifact/adapter/filesystem-artifact-cache.js';
import { ARTIFACT_SCHEMA_VERSION } from '../../../src/artifact/artifact-schema-version.js';
import { NodeHashService } from '../../../src/hashing/node-hash-service.js';
import { createMockArtifactOutputFingerprinter } from '../../helpers/create-artifact-output-fingerprint-fixtures.js';
import { createTestArtifact } from '../../helpers/create-artifact.js';
import { createMockArtifactLayoutFactory } from '../../helpers/create-mock-artifact-layout-factory.js';
import { createMockArtifactLayout } from '../../helpers/create-mock-artifact-layout.js';
import { createMockArtifactPublisher } from '../../helpers/create-mock-artifact-publisher.js';
import { createMockFilesystem } from '../../helpers/create-mock-filesystem.js';
import { createTestPathService } from '../../helpers/create-path-service.js';

describe('FilesystemArtifactCache', () => {
  it('should publish artifact manifest when saving an artifact', async () => {
    const artifact = createTestArtifact();
    const filesystem = createMockFilesystem();
    const publisher = createMockArtifactPublisher();
    const pathService = createTestPathService();
    const layout = createMockArtifactLayout();
    const fingerprinter = createMockArtifactOutputFingerprinter();
    const comparator = new ArtifactOutputComparator();
    const layoutFactory = createMockArtifactLayoutFactory(layout);

    const cache = new FilesystemArtifactCache(
      layoutFactory,
      publisher,
      filesystem,
      pathService,
      fingerprinter,
      comparator,
    );

    const outputs = ['dist/index.js'];

    await cache.save(artifact, '/workspace', outputs);

    expect(vi.mocked(publisher.publish)).toHaveBeenCalledWith(
      '/workspace',
      expect.objectContaining({
        artifact,
        outputs,
      }),
      layout,
    );
  });
  it('restores a directory output when a file inside it is missing', async () => {
    const artifact = createTestArtifact();
    const filesystem = createMockFilesystem();
    const pathService = createTestPathService();
    const layout = createMockArtifactLayout();
    const fingerprinter = new ArtifactOutputFingerprinter(
      filesystem,
      pathService,
      new NodeHashService(),
    );

    const cache = new FilesystemArtifactCache(
      createMockArtifactLayoutFactory(layout),
      createMockArtifactPublisher(),
      filesystem,
      pathService,
      fingerprinter,
      new ArtifactOutputComparator(),
    );

    const originalDeclaration = 'export declare const value: number;';
    const originalImplementation = 'export const value = 1;';

    // Artefacto almacenado en caché.
    await filesystem.createDirectory('/cache/artifact/dist');
    await filesystem.write('/cache/artifact/dist/index.js', originalImplementation);
    await filesystem.write('/cache/artifact/dist/index.d.ts', originalDeclaration);

    // Workspace con el mismo output, pero incompleto.
    await filesystem.createDirectory('/workspace/dist');
    await filesystem.write('/workspace/dist/index.js', originalImplementation);

    const outputs = ['dist'];
    const outputFingerprint = await fingerprinter.fingerprint('/cache/artifact', outputs);

    await filesystem.writeJson(layout.manifest(), {
      artifact,
      outputs,
      outputFingerprint,
      createdAt: Date.now(),
      schemaVersion: ARTIFACT_SCHEMA_VERSION,
    });

    // Confirmar que el workspace está incompleto.
    expect(await filesystem.exists('/workspace/dist')).toBe(true);
    expect(await filesystem.exists('/workspace/dist/index.d.ts')).toBe(false);

    // Restaurar desde caché.
    const restored = await cache.restore(artifact, '/workspace');

    // Verificar recuperación.
    expect(restored).toBe(true);
    expect(await filesystem.read('/workspace/dist/index.d.ts')).toBe(originalDeclaration);
    expect(await filesystem.read('/workspace/dist/index.js')).toBe(originalImplementation);

    // La salida restaurada debe tener el fingerprint original.
    const restoredFingerprint = await fingerprinter.fingerprint('/workspace', outputs);

    expect(restoredFingerprint).toEqual(outputFingerprint);
  });
});
