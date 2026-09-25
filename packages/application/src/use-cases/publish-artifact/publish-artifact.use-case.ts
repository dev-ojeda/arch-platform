// packages/application/src/use-cases/publish-artifact/publish-artifact.use-case.ts

import type {
  ArtifactLayout,
  ArtifactManifest,
  ArtifactPublisher,
  ComplianceEnvironment,
  PublicationArtifactReader,
  PublicationBlockReason,
} from '@arch-platform/platform-model';

export interface PublishArtifactInput {
  readonly workspaceRoot: string;
  readonly environment: ComplianceEnvironment;
  readonly artifact: string;
  readonly manifest: ArtifactManifest;
  readonly layout: ArtifactLayout;
}

export class PublishArtifactUseCase {
  constructor(
    private readonly reader: PublicationArtifactReader,
    private readonly publisher: ArtifactPublisher,
  ) {}

  public async execute(input: PublishArtifactInput): Promise<void> {
    const context = await this.reader.read(input.workspaceRoot, input.environment, input.artifact);

    if (!context) {
      throw new Error(`Artifact "${input.artifact}" publication state is unavailable`);
    }

    const reasons: PublicationBlockReason[] = [];

    if (context.complianceStatus !== 'approved') {
      reasons.push('compliance-not-approved');
    }

    if (context.complianceApprovedHash !== context.artifactHash) {
      reasons.push('compliance-hash-mismatch');
    }

    if (context.securityEvaluationStatus !== 'secure') {
      reasons.push('security-not-secure');
    }

    if (context.securityDecisionStatus !== 'allowed') {
      reasons.push('security-not-allowed');
    }

    if (context.securityArtifactHash !== context.artifactHash) {
      reasons.push('security-hash-mismatch');
    }

    if (reasons.length > 0) {
      throw new Error(`Artifact "${input.artifact}" cannot be published: ${reasons.join(', ')}`);
    }

    await this.publisher.publish(input.workspaceRoot, input.manifest, input.layout);
  }
}
