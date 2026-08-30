// packages/governance/src/context/build-compliance-context.ts

import type {
  ArtifactStateReader,
  ComplianceStateReader,
  WorkspaceDescriptor,
} from '@arch/platform-model';

import type { ComplianceOptions } from '../public/compliance-options.js';

import type { ComplianceContext } from './compliance-context.js';
import { resolveComplianceScope } from './resolve-compliance-scope.js';

export async function buildComplianceContext(
  options: ComplianceOptions,
  workspace: WorkspaceDescriptor,
  artifactStatesReader: ArtifactStateReader,
  complianceStatesReader: ComplianceStateReader,
): Promise<ComplianceContext> {
  const scope = resolveComplianceScope(options);
  const artifactStates = await artifactStatesReader.read(scope.root);
  const complianceStates = await complianceStatesReader.read(scope.root);

  return {
    workspace,
    scope: scope,
    artifactStates,
    complianceStates,
  };
}
