// packages\infrastructure\test\__tests__\artifact\filesystem-artifact-cache.test.ts

import { runArtifactCacheContract } from '@arch/testing';

import { createFilesystemArtifactCacheFixture } from '../../helpers/create-filesystem-artifact-cache-fixture.js';

runArtifactCacheContract(createFilesystemArtifactCacheFixture);
