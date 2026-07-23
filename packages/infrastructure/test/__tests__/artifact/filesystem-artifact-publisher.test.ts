// packages\infrastructure\test\__tests__\artifact\filesystem-artifact-publisher.test.ts

import { runArtifactPublisherContract } from '@arch/testing';

import { createFilesystemArtifactPublisherFixture } from '../../helpers/create-filesystem-artifact-publisher-fixture.js';

runArtifactPublisherContract(createFilesystemArtifactPublisherFixture);
