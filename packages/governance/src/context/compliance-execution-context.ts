// packages/governance/src/context/compliance-execution-context.ts

import type { ComplianceArtifactContext } from './compliance-artifact-context.js';
import type { ComplianceContext } from './compliance-context.js';

export interface ComplianceExecutionContext extends ComplianceContext {
  readonly artifacts: readonly ComplianceArtifactContext[];
}
