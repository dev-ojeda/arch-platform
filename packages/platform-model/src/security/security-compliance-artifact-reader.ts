// packages/platform-model/src/security/security-compliance-artifact-reader.ts

import type { SecurityEnvironment } from './environment/security-environment.js';
import type { SecurityComplianceArtifact } from './security-compliance-artifact.js';

export interface SecurityComplianceArtifactReader {
  read(packageName: string, environment: SecurityEnvironment): Promise<SecurityComplianceArtifact>;
}
