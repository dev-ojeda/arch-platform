// packages/platform-model/src/distribution/artifact-distribution-prepared-provider-port.ts

import type { ArtifactDistributionPreparedReader } from './artifact-distribution-prepared-reader.js';
import type { ArtifactDistributionPreparedWriter } from './artifact-distribution-prepared-writer.js';

export interface ArtifactDistributionPreparedProviderPort {
  createReaderForWorkspace(workspaceRoot: string): ArtifactDistributionPreparedReader;

  createWriterForWorkspace(workspaceRoot: string): Promise<ArtifactDistributionPreparedWriter>;
}
