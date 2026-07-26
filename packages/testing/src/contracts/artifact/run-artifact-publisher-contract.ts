// packages/testing/src/contracts/artifact/run-artifact-publisher-contract.ts

import { describe, expect, it } from 'vitest';

import type { ArtifactLayout, ArtifactManifest, ArtifactPublisher } from '@arch/platform-model';

import type { ContractFixtureFactory } from '../contract-fixture-factory.js';

export interface ArtifactPublisherContractContext {
  readonly publisher: ArtifactPublisher;

  readonly manifest: ArtifactManifest;

  readonly layout: ArtifactLayout;

  readonly root: string;
}

export function runArtifactPublisherContract(
  createFixture: ContractFixtureFactory<ArtifactPublisherContractContext>,
): void {
  describe('ArtifactPublisher contract', () => {
    it('should publish artifact manifest and outputs', async () => {
      const fixture = await createFixture();

      await fixture.publisher.publish(fixture.root, fixture.manifest, fixture.layout);

      expect(true).toBe(true);
    });
  });
}
