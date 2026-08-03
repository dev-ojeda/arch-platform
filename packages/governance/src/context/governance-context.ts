// packages/governance/src/context/governance-context.ts

import type { AnalysisContext } from '@arch/code-analysis';
import type { WorkspaceDescriptor } from '@arch/platform-model';

import type { GovernanceScope } from '../public/governance-scope.js';

export interface GovernanceContext {
  readonly workspace: WorkspaceDescriptor;
  readonly scope: GovernanceScope;
}

export interface GovernanceExecutionContext extends GovernanceContext {
  readonly analysis: AnalysisContext;
}
