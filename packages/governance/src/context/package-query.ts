// packages/governance/src/context/package-query.ts

import type { PackageDescriptor } from '@arch/platform-model';

import type { GovernanceScope } from '../public/governance-scope.js';

export interface PackageQuery {
  get(name: string): PackageDescriptor | undefined;
  require(name: string): PackageDescriptor;
  all(): readonly PackageDescriptor[];
  scoped(scope: GovernanceScope): readonly PackageDescriptor[];
}
