// packages/build-core/test/__tests__/artifact/artifact-manifest-reader.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { readArtifactManifest } from '../../../src/artifact/artifact-reader.js';
import * as fs from '../../../src/fs/fs-async.js';
import { createArtifactManifest } from '../../helpers/artifact-manifest.js';

vi.mock('../../../src/fs/fs-async.js');

describe('readArtifactManifest', () => {
  const filePath = '/tmp/manifest.json';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return undefined when the manifest does not exist', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(false);

    const manifest = await readArtifactManifest(filePath);

    expect(manifest).toBeUndefined();

    expect(fs.readJsonFile).not.toHaveBeenCalled();
  });

  it('should return the manifest when it is valid', async () => {
    const expected = createArtifactManifest();

    vi.mocked(fs.pathExists).mockResolvedValue(true);
    vi.mocked(fs.readJsonFile).mockResolvedValue(expected);

    const manifest = await readArtifactManifest(filePath);

    expect(manifest).toEqual(expected);
  });

  it('should return undefined when the manifest is invalid', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true);
    vi.mocked(fs.readJsonFile).mockResolvedValue({
      invalid: true,
    });

    const manifest = await readArtifactManifest(filePath);

    expect(manifest).toBeUndefined();
  });

  it('should return undefined when the schema version is invalid', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true);
    vi.mocked(fs.readJsonFile).mockResolvedValue(
      createArtifactManifest({
        schemaVersion: 999,
      }),
    );

    const manifest = await readArtifactManifest(filePath);

    expect(manifest).toBeUndefined();
  });

  it('should return undefined when the artifact is invalid', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true);
    vi.mocked(fs.readJsonFile).mockResolvedValue({
      ...createArtifactManifest(),
      artifact: {
        packageName: '@arch/build-core',
      },
    });

    const manifest = await readArtifactManifest(filePath);

    expect(manifest).toBeUndefined();
  });

  it('should return undefined when the outputs are invalid', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true);
    vi.mocked(fs.readJsonFile).mockResolvedValue({
      ...createArtifactManifest(),
      outputs: [123],
    });

    const manifest = await readArtifactManifest(filePath);

    expect(manifest).toBeUndefined();
  });
});
