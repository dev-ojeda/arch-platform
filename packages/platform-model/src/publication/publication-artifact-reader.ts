// packages/platform-model/src/publication/publication-artifact-reader.ts

import type { PublicationArtifactContext } from './publication-artifact-context.js';
import type { ComplianceEnvironment } from '../compliance/environment/compliance-environment.js';


export interface PublicationArtifactReader {
  read(
    environment: ComplianceEnvironment,
    artifact: string,
  ): Promise<PublicationArtifactContext | undefined>;
}
