// packages/infrastructure/test/__tests__/artifact/default-artifact-provider.test.ts

import { describe, expect, it } from 'vitest';

import { DefaultArtifactProvider } from '../../../src/artifact/adapter/default-artifact-provider.js';
import { createTestHashResult } from '../../helpers/create-hash-result.js';

describe('DefaultArtifactProvider', () => {
  it('should concatenate source, config and dependency hashes', () => {
    const provider = new DefaultArtifactProvider();

    const artifact = provider.create('@arch-platform/build-core', createTestHashResult());

    expect(artifact).toEqual({
      packageName: '@arch-platform/build-core',
      id: 'source-config-deps',
    });
  });

  it('should produce a different key when source hash changes', () => {
    const provider = new DefaultArtifactProvider();

    expect(provider.create('@arch/test', createTestHashResult({ sourceHash: 'a' })).id).not.toBe(
      provider.create('@arch/test', createTestHashResult({ sourceHash: 'b' })).id,
    );
  });

  it('should produce a different key when config hash changes', () => {
    const provider = new DefaultArtifactProvider();

    expect(
      provider.create('@arch/test', createTestHashResult({ configHash: 'config-a' })).id,
    ).not.toBe(provider.create('@arch/test', createTestHashResult({ configHash: 'config-b' })).id);
  });

  it('should produce a different key when dependency hash changes', () => {
    const provider = new DefaultArtifactProvider();

    expect(provider.create('@arch/test', createTestHashResult({ depsHash: 'deps-a' })).id).not.toBe(
      provider.create('@arch/test', createTestHashResult({ depsHash: 'deps-b' })).id,
    );
  });

  it('should preserve the package name', () => {
    const provider = new DefaultArtifactProvider();

    const artifact = provider.create('@arch/custom-package', createTestHashResult());

    expect(artifact.packageName).toBe('@arch/custom-package');
  });
});
