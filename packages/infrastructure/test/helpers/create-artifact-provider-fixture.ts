// packages/infrastructure/test/helpers/create-artifact-provider-fixture.ts

import type { ArtifactProviderContractContext } from '@arch/testing';

import { DefaultArtifactProvider } from '../../src/artifact/adapter/default-artifact-provider.js';

export function createArtifactProviderFixture(): ArtifactProviderContractContext {
  return {
    provider: new DefaultArtifactProvider(),
  };
}
