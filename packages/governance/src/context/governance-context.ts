// packages/governance/src/context/governance-context.ts

import type { AnalysisContext } from '@arch/code-analysis';
import type { ArchitectureManifest, WorkspaceDescriptor } from '@arch/platform-model';

import type { GovernanceScope } from '../public/governance-scope.js';

import { GovernancePackageQuery } from './governance-package-query.js';

export interface GovernanceContext {
  readonly archManifest?: ArchitectureManifest;
  readonly workspace: WorkspaceDescriptor;
  readonly scope: GovernanceScope;
  readonly packages: GovernancePackageQuery;
}

export interface GovernancePackageAnalysis {
  readonly packageName: string;
  readonly analysis: AnalysisContext;
}

export interface GovernanceExecutionContext extends GovernanceContext {
  readonly analyses: readonly GovernancePackageAnalysis[];
}
