// packages/platform-model/src/security/security-execution-context.ts

import type { DependencyGraph } from '../dependency/dependency-graph.js';

import type { SecurityAdvisory } from './security-advisory.js';
import type { SecurityDecisionStatus } from './security-decision-status.js';

export interface SecurityExecutionContext {
  readonly packageName: string;
  readonly artifactHash: string;
  readonly complianceStatus: string;
  readonly previousSecurityStatus: SecurityDecisionStatus | undefined;
  readonly dependencyGraph: DependencyGraph;
  readonly advisories: readonly SecurityAdvisory[];
}
