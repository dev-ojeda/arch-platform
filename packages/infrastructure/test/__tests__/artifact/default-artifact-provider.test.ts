// packages/infrastructure/test/__tests__/artifact/default-artifact-provider.test.ts

import { runArtifactProviderContract } from '@arch/testing';

import { createArtifactProviderFixture } from '../../helpers/create-artifact-provider-fixture.js';

runArtifactProviderContract(createArtifactProviderFixture);
