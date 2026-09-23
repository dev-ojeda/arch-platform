// packages/platform-model/src/security/security-compliance-artifact-reader.ts

import type { SecurityComplianceArtifact } from './security-compliance-artifact.js';

export interface SecurityComplianceArtifactReader {
  read(root: string, packageName?: string): Promise<SecurityComplianceArtifact>;
}
