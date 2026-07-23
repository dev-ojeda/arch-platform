// packages/testing/src/contracts/artifact/run-artifact-provider-contract.ts

import type { ArtifactProvider } from '@arch/platform-model';
import { expect, it } from 'vitest';

import { createTestHashResult } from '../../hash/create-test-hash-result.js';
import type { ContractFixtureFactory } from '../contract-fixture-factory.js';

export interface ArtifactProviderContractContext {
  readonly provider: ArtifactProvider;
}

export function runArtifactProviderContract(
  createFixture: ContractFixtureFactory<ArtifactProviderContractContext>,
): void {
  it('should concatenate source, config and dependency hashes', async () => {
    const fixture = await createFixture();

    const artifact = fixture.provider.create('@arch/build-core', createTestHashResult());

    expect(artifact).toEqual({
      packageName: '@arch/build-core',
      id: 'source-config-deps',
    });
  });
  it('should produce a different key when source hash changes', async () => {
    const fixture = await createFixture();

    expect(
      fixture.provider.create(
        '@arch/test',
        createTestHashResult({
          sourceHash: 'a',
        }),
      ).id,
    ).not.toBe(
      fixture.provider.create(
        '@arch/test',
        createTestHashResult({
          sourceHash: 'b',
        }),
      ).id,
    );
  });

  it('should produce a different key when config hash changes', async () => {
    const fixture = await createFixture();

    expect(
      fixture.provider.create(
        '@arch/test',
        createTestHashResult({
          configHash: 'config-a',
        }),
      ).id,
    ).not.toBe(
      fixture.provider.create(
        '@arch/test',
        createTestHashResult({
          configHash: 'config-b',
        }),
      ).id,
    );
  });

  it('should produce a different key when dependency hash changes', async () => {
    const fixture = await createFixture();

    expect(
      fixture.provider.create(
        '@arch/test',
        createTestHashResult({
          depsHash: 'deps-a',
        }),
      ).id,
    ).not.toBe(
      fixture.provider.create(
        '@arch/test',
        createTestHashResult({
          depsHash: 'deps-b',
        }),
      ).id,
    );
  });
  it('should preserve the package name', async () => {
    const fixture = await createFixture();

    const artifact = fixture.provider.create('@arch/custom-package', createTestHashResult());

    expect(artifact.packageName).toBe('@arch/custom-package');
  });
}
