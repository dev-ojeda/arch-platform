// packages/platform-model/src/security/security-compliance-artifact-reader.ts

import type { SecurityComplianceArtifact } from './security-compliance-artifact.js';

export interface SecurityComplianceArtifactReader {
  read(packageName?: string): Promise<SecurityComplianceArtifact>;
}
