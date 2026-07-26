// packages/testing/src/contracts/artifact/run-artifact-cache-contract.ts
import { describe, expect, it, type Mocked } from 'vitest';

import type {
  Artifact,
  ArtifactCache,
  ArtifactLayout,
  ArtifactPublisher,
} from '@arch/platform-model';

import type { ContractFixtureFactory } from '../contract-fixture-factory.js';

export interface ArtifactCacheContractContext {
  readonly cache: ArtifactCache;

  readonly artifact: Artifact;

  readonly publisher: Mocked<ArtifactPublisher>;

  readonly layout: ArtifactLayout;
}

export function runArtifactCacheContract(
  createFixture: ContractFixtureFactory<ArtifactCacheContractContext>,
): void {
  describe('ArtifactCache contract', () => {
    it('should publish artifact manifest when saving an artifact', async () => {
      const fixture = await createFixture();

      const outputs = ['dist/index.js'];

      await fixture.cache.save(fixture.artifact, '/workspace', outputs);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(fixture.publisher.publish).toHaveBeenCalledWith(
        '/workspace',
        expect.objectContaining({
          artifact: fixture.artifact,
          outputs,
        }),
        fixture.layout,
      );
    });
  });
}
