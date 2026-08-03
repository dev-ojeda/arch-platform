// packages/governance/src/context/build-governance-context.ts

import type { WorkspaceDescriptor } from '@arch/platform-model';

import type { GovernanceOptions } from '../public/governance-options.js';

import type { GovernanceContext } from './governance-context.js';
import { resolveGovernanceScope } from './resolve-governance-scope.js';

export function buildGovernanceContext(
  options: GovernanceOptions,
  workspace: WorkspaceDescriptor,
): GovernanceContext {
  return {
    workspace,
    scope: resolveGovernanceScope(options),
  };
}
