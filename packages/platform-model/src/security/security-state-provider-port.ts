// packages/platform-model/src/security/security-state-provider-port.ts

import type { SecurityStateReader } from '../ports/security-state-reader.js';
import type { SecurityStateWriter } from '../ports/security-state-writer.js';

import type { SecurityComplianceArtifactReader } from './security-compliance-artifact-reader.js';
import type { SecurityState } from './security-state.js';

export interface SecurityStateProviderPort {
  createReaderForWorkspace(workspaceRoot: string): SecurityStateReader;
  createComplianceArtifactReaderForWorkspace(
    workspaceRoot: string,
  ): SecurityComplianceArtifactReader;
  createWriterForWorkspace(workspaceRoot: string, state: SecurityState): SecurityStateWriter;
}
