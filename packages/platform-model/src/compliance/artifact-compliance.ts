// packages/platform-model/src/compliance/artifact-compliance.ts

import type { Artifact } from '../artifact/artifact.js';
import type { Diagnostic } from '../diagnostics/diagnostic.js';

import type { ArtifactComplianceStatus } from './compliance-status.js';
import type { ComplianceTopic } from './compliance-topic.js';

export interface ArtifactCompliance {
  readonly artifact: Artifact;
  readonly status: ArtifactComplianceStatus;
  readonly topics: readonly ComplianceTopic[];
  readonly evaluatedAt: number;
  readonly diagnostics: readonly Diagnostic[];
}
