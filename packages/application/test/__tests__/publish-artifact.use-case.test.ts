// packages\application\test\__tests__\publish-artifact.use-case.test.ts

import { describe, expect, it, vi } from 'vitest';

import { PublishArtifactUseCase } from '@arch-platform/application';
import type {
  ArtifactPublisher,
  ComplianceEnvironment,
  PublicationArtifactContext,
  PublicationArtifactReader,
} from '@arch-platform/platform-model';
import { createMockArtifactLayout, createTestArtifactManifest } from '@arch-platform/testing';

export const fixture: PublicationArtifactContext = {
  artifact: '@arch-platform/code-analysis',

  artifactHash: 'sha512-test-code-analysis',
  artifactStatus: 'built',

  complianceStatus: 'approved',
  complianceApprovedHash: 'sha512-test-code-analysis',

  securityPreviousStatus: 'blocked',
  securityEvaluationStatus: 'blocked',
  securityDecisionStatus: 'blocked',
  securityArtifactHash: 'sha512-test-code-analysis',
};

const publishableFixture: PublicationArtifactContext = {
  ...fixture,
  securityEvaluationStatus: 'secure',
  securityDecisionStatus: 'allowed',
};

describe('PublishArtifactUseCase', () => {
  it('publishes the artifact when publication state is eligible', async () => {
    const reader: PublicationArtifactReader = {
      read: vi.fn().mockResolvedValue(publishableFixture),
    };

    const publisher: ArtifactPublisher = {
      publish: vi.fn(),
    };

    const useCase = new PublishArtifactUseCase(reader, publisher);

    const workspaceRoot = '/workspace';
    const artifact = '@arch-platform/code-analysis';
    const environment: ComplianceEnvironment = 'dev';
    const manifest = createTestArtifactManifest();
    const layout = createMockArtifactLayout();

    await useCase.execute({
      workspaceRoot,
      artifact,
      environment,
      manifest,
      layout,
    });

    expect(reader.read).toHaveBeenCalledOnce();
    expect(reader.read).toHaveBeenCalledWith(workspaceRoot, environment, artifact);

    expect(publisher.publish).toHaveBeenCalledOnce();
    expect(publisher.publish).toHaveBeenCalledWith(workspaceRoot, manifest, layout);
  });

  it('does not publish the artifact when security blocks publication', async () => {
    const reader: PublicationArtifactReader = {
      read: vi.fn().mockResolvedValue(fixture),
    };

    const publisher: ArtifactPublisher = {
      publish: vi.fn(),
    };

    const useCase = new PublishArtifactUseCase(reader, publisher);

    await expect(
      useCase.execute({
        workspaceRoot: '/workspace',
        artifact: '@arch-platform/code-analysis',
        manifest: createTestArtifactManifest(),
        layout: createMockArtifactLayout(),
      }),
    ).rejects.toThrow('Artifact "@arch-platform/code-analysis" cannot be published');

    expect(publisher.publish).not.toHaveBeenCalled();
  });

  it('propagates publisher errors', async () => {
    const error = new Error('Publication failed');

    const reader: PublicationArtifactReader = {
      read: vi.fn().mockResolvedValue(publishableFixture),
    };

    const publisher: ArtifactPublisher = {
      publish: vi.fn().mockRejectedValue(error),
    };

    const useCase = new PublishArtifactUseCase(reader, publisher);

    await expect(
      useCase.execute({
        workspaceRoot: '/workspace',
        artifact: '@arch-platform/code-analysis',
        manifest: createTestArtifactManifest(),
        layout: createMockArtifactLayout(),
      }),
    ).rejects.toThrow(error);
  });

  it('does not publish when publication state is unavailable', async () => {
    const reader: PublicationArtifactReader = {
      read: vi.fn().mockResolvedValue(undefined),
    };

    const publisher: ArtifactPublisher = {
      publish: vi.fn(),
    };

    const useCase = new PublishArtifactUseCase(reader, publisher);

    await expect(
      useCase.execute({
        workspaceRoot: '/workspace',
        environment: 'dev',
        artifact: '@arch-platform/code-analysis',
        manifest: createTestArtifactManifest(),
        layout: createMockArtifactLayout(),
      }),
    ).rejects.toThrow('Artifact "@arch-platform/code-analysis" publication state is unavailable');

    expect(publisher.publish).not.toHaveBeenCalled();
  });
});
