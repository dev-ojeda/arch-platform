import { describe, expect, it } from 'vitest';

import { createArtifactKey } from '../../../src/artifact/artifact-key.js';
import type { HashResult } from '../../../src/hash/hash-result.js';

const hash = (overrides: Partial<HashResult> = {}): HashResult => ({
  hash: 'hash',
  sourceHash: 'source',
  configHash: 'config',
  depsHash: 'deps',
  schemaVersion: 1,
  ...overrides,
});

describe('createArtifactKey', () => {
  it('should concatenate source, config and dependency hashes', () => {
    expect(createArtifactKey(hash())).toBe('source-config-deps');
  });

  it('should produce a different key when source hash changes', () => {
    expect(createArtifactKey(hash({ sourceHash: 'source-a' }))).not.toBe(
      createArtifactKey(hash({ sourceHash: 'source-b' })),
    );
  });

  it('should produce a different key when config hash changes', () => {
    expect(createArtifactKey(hash({ configHash: 'config-a' }))).not.toBe(
      createArtifactKey(hash({ configHash: 'config-b' })),
    );
  });

  it('should produce a different key when dependency hash changes', () => {
    expect(createArtifactKey(hash({ depsHash: 'deps-a' }))).not.toBe(
      createArtifactKey(hash({ depsHash: 'deps-b' })),
    );
  });
});
