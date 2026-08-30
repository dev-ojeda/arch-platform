// packages/governance/src/context/governance-context.ts

import type { ArchitectureManifest, WorkspaceDescriptor } from '@arch/platform-model';

import type { GovernanceScope } from '../public/governance-scope.js';

import type { PackageQuery } from './package-query.js';

export interface GovernanceContext {
  readonly archManifest?: ArchitectureManifest;

  readonly workspace: WorkspaceDescriptor;

  readonly scope: GovernanceScope;

  readonly packages: PackageQuery;
}
