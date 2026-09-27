// packages/platform-model/src/publication/publication-artifact-reader.ts

import type { ComplianceEnvironment } from '../compliance/environment/compliance-environment.js';

import type { PublicationArtifactContext } from './publication-artifact-context.js';

export interface PublicationArtifactReader {
  read(
    workspaceRoot: string,
    environment: ComplianceEnvironment,
    artifact: string,
  ): Promise<PublicationArtifactContext | undefined>;
}
