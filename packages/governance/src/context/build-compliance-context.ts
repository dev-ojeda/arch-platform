// packages/governance/src/context/build-compliance-context.ts

import type { ArtifactState, ComplianceState, WorkspaceDescriptor } from '@arch/platform-model';

import type { ComplianceOptions } from '../public/compliance-options.js';

import type { ComplianceContext } from './compliance-context.js';
import { resolveComplianceScope } from './resolve-compliance-scope.js';

export function buildComplianceContext(
  options: ComplianceOptions,
  workspace: WorkspaceDescriptor,
  artifactStates: ReadonlyMap<string, ArtifactState>,
  complianceStates: ComplianceState,
): ComplianceContext {
  return {
    workspace,
    scope: resolveComplianceScope(options),
    artifactStates,
    complianceStates,
  };
}
