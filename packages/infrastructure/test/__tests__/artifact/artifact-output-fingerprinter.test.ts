import { describe, expect, it } from 'vitest';

import { ArtifactOutputFingerprinter } from '../../../src/artifact/adapter/artifact-output-fingerprinter.js';
import { NodeHashService } from '../../../src/hashing/node-hash-service.js';
import { createMemoryFilesystem } from '../../helpers/create-memory-filesystem.js';
import { createTestPathService } from '../../helpers/create-path-service.js';

describe('ArtifactOutputFingerprinter', () => {
  async function createFixture() {
    const filesystem = createMemoryFilesystem();
    const fingerprinter = new ArtifactOutputFingerprinter(
      filesystem,
      createTestPathService(),
      new NodeHashService(),
    );

    await filesystem.createDirectory('/workspace/dist');
    await filesystem.write('/workspace/dist/index.js', 'export const value = 1;');
    await filesystem.write('/workspace/dist/index.d.ts', 'export declare const value: number;');

    return { filesystem, fingerprinter };
  }

  it('produces a stable fingerprint for unchanged outputs', async () => {
    const { fingerprinter } = await createFixture();

    const first = await fingerprinter.fingerprint('/workspace', ['dist']);
    const second = await fingerprinter.fingerprint('/workspace', ['dist']);

    expect(first).toEqual(second);
    expect(first[0]).toMatchObject({
      path: 'dist',
      sizeInBytes:
        Buffer.byteLength('export const value = 1;') +
        Buffer.byteLength('export declare const value: number;'),
    });
    expect(first[0]?.integrity).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it('detects a modified file', async () => {
    const { filesystem, fingerprinter } = await createFixture();

    const before = await fingerprinter.fingerprint('/workspace', ['dist']);

    await filesystem.write('/workspace/dist/index.js', 'export const value = 2;');

    const after = await fingerprinter.fingerprint('/workspace', ['dist']);

    expect(after[0]?.integrity).not.toBe(before[0]?.integrity);
  });

  it('detects an added file', async () => {
    const { filesystem, fingerprinter } = await createFixture();

    const before = await fingerprinter.fingerprint('/workspace', ['dist']);

    await filesystem.write('/workspace/dist/extra.js', 'export const extra = true;');

    const after = await fingerprinter.fingerprint('/workspace', ['dist']);

    expect(after[0]?.integrity).not.toBe(before[0]?.integrity);
  });

  it('detects a deleted file', async () => {
    const { filesystem, fingerprinter } = await createFixture();

    const before = await fingerprinter.fingerprint('/workspace', ['dist']);

    await filesystem.remove('/workspace/dist/index.d.ts');

    const after = await fingerprinter.fingerprint('/workspace', ['dist']);

    expect(after[0]?.integrity).not.toBe(before[0]?.integrity);
  });

  it('fingerprints an empty directory deterministically', async () => {
    const { filesystem, fingerprinter } = await createFixture();

    await filesystem.remove('/workspace/dist');
    await filesystem.createDirectory('/workspace/empty');

    const first = await fingerprinter.fingerprint('/workspace', ['empty']);
    const second = await fingerprinter.fingerprint('/workspace', ['empty']);

    expect(first).toEqual(second);
    expect(first[0]?.sizeInBytes).toBe(0);
    expect(first[0]?.integrity).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it('rejects a missing output', async () => {
    const { fingerprinter } = await createFixture();

    await expect(fingerprinter.fingerprint('/workspace', ['missing'])).rejects.toThrow(
      'Cannot fingerprint missing artifact output',
    );
  });
});
