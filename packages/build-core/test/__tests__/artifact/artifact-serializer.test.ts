import { describe, expect, it } from 'vitest';

import {
  deserializeArtifactManifest,
  serializeArtifactManifest,
} from '../../../src/artifact/artifact-serializer.js';
import { createArtifactManifest } from '../../helpers/artifact-manifest.js';

describe('artifact serializer', () => {
  it('should serialize an artifact manifest', () => {
    const manifest = createArtifactManifest();

    const result = serializeArtifactManifest(manifest);

    expect(result).toBe(JSON.stringify(manifest));
  });

  it('should deserialize a valid artifact manifest', () => {
    const manifest = createArtifactManifest();

    const serialized = JSON.stringify(manifest);

    const result = deserializeArtifactManifest(serialized);

    expect(result).toEqual(manifest);
  });

  it('should return undefined when json is invalid', () => {
    const result = deserializeArtifactManifest('{invalid-json');

    expect(result).toBeUndefined();
  });

  it('should return undefined when manifest is invalid', () => {
    const result = deserializeArtifactManifest(
      JSON.stringify({
        invalid: true,
      }),
    );

    expect(result).toBeUndefined();
  });

  it('should return undefined when schema version is invalid', () => {
    const result = deserializeArtifactManifest(
      JSON.stringify(
        createArtifactManifest({
          schemaVersion: 999,
        }),
      ),
    );

    expect(result).toBeUndefined();
  });

  it('should serialize and deserialize an artifact manifest without losing data', () => {
    const manifest = createArtifactManifest({
      outputs: ['dist/index.js', 'dist/index.d.ts'],
    });

    const result = deserializeArtifactManifest(serializeArtifactManifest(manifest));

    expect(result).toEqual(manifest);
  });
});
