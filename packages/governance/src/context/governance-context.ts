// packages/governance/src/context/governance-context.ts

import type { PackageDependencyGraph, SymbolGraph } from '@arch/code-analysis';
import type { WorkspaceDescriptor } from '@arch/platform-model';

export interface GovernanceContext {
  readonly workspace: WorkspaceDescriptor;
}

export interface GovernanceAnalysisContext {
  readonly symbolGraph: SymbolGraph;

  readonly packageGraph: PackageDependencyGraph;
}

export interface GovernanceExecutionContext extends GovernanceContext {
  readonly analysis: GovernanceAnalysisContext;
}
