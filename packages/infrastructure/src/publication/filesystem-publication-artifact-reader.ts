// packages/infrastructure/src/publication/filesystem-publication-artifact-reader.ts

import type {
  ArtifactStateReader,
  ComplianceEnvironment,
  ComplianceStateReader,
  PublicationArtifactContext,
  PublicationArtifactReader,
  SecurityStateReader,
} from '@arch-platform/platform-model';

export class FilesystemPublicationArtifactReader implements PublicationArtifactReader {
  constructor(
    private readonly artifactStateReader: ArtifactStateReader,
    private readonly complianceStateReader: ComplianceStateReader,
    private readonly securityStateReader: SecurityStateReader,
  ) {}

  async read(
    workspaceRoot: string,
    environment: ComplianceEnvironment,
    artifact: string,
  ): Promise<PublicationArtifactContext | undefined> {
    const artifactStates = await this.artifactStateReader.read();
    const artifactState = artifactStates.get(artifact);

    if (!artifactState) {
      return undefined;
    }

    const complianceState = await this.complianceStateReader.read(workspaceRoot, environment);

    const complianceArtifact = complianceState.environment.artifacts[artifact];

    if (!complianceArtifact) {
      return undefined;
    }

    const securityState = await this.securityStateReader.read(workspaceRoot);
    const securityArtifact = securityState.artifacts[artifact];

    if (!securityArtifact) {
      return undefined;
    }

    return {
      artifact,
      artifactHash: artifactState.hash.hash,
      artifactStatus: artifactState.status,
      complianceStatus: complianceArtifact.status,
      complianceApprovedHash: complianceArtifact.approvedHash?.hash,
      securityPreviousStatus: securityArtifact.previousStatus,
      securityEvaluationStatus: securityArtifact.evaluation.status,
      securityDecisionStatus: securityArtifact.decision.status,
      securityArtifactHash: securityArtifact.evaluation.artifactHash,
    };
  }
}
