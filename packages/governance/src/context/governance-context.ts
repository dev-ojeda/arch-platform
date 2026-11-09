// packages/governance/src/context/governance-context.ts

import type { ArchitectureManifest, WorkspaceDescriptor } from '@arch-platform/platform-model';

import type { PackageQuery } from './package-query.js';
import type { GovernanceScope } from '../public/governance-scope.js';


export interface GovernanceContext {
  readonly archManifest?: ArchitectureManifest;

  readonly workspace: WorkspaceDescriptor;

  readonly scope: GovernanceScope;

  readonly packages: PackageQuery;
}
