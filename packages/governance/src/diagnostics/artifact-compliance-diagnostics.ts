// packages/governance/src/diagnostics/artifact-compliance-diagnostics.ts

import type { Diagnostic } from '@arch/platform-model';

import type { ComplianceDependencyContext } from '../compliance/compliance-dependencies-context.js';
import type { ComplianceArtifactContext } from '../context/compliance-artifact-context.js';

export function dependencyNotCompliant(
  artifact: ComplianceArtifactContext,
  dependency: ComplianceDependencyContext,
): Diagnostic {
  const isApproved = dependency.complianceStatus === 'approved';

  const hashChanged =
    isApproved &&
    dependency.artifactHash !== undefined &&
    dependency.complianceApprovedHash !== undefined &&
    dependency.artifactHash.hash !== dependency.complianceApprovedHash.hash;

  return {
    code: 'ARCH_DEPENDENCY_NOT_COMPLIANT',
    severity: 'warning',
    source: 'governance',

    message: hashChanged
      ? `Artifact "${artifact.artifact.name}" has dependency ` +
        `"${dependency.artifact}" whose approved hash is no longer current.`
      : `Artifact "${artifact.artifact.name}" has dependency ` +
        `"${dependency.artifact}" that is not approved.`,

    hint: hashChanged
      ? `Dependency "${dependency.artifact}" is approved for a previous hash ` +
        `but requires re-evaluation because its artifact hash has changed.`
      : `Dependency "${dependency.artifact}" is currently ` +
        `"${dependency.complianceStatus ?? 'not evaluated'}".`,

    metadata: {
      artifact: artifact.artifact.name,
      dependency: dependency.artifact,
      artifactStatus: dependency.artifactStatus,
      complianceStatus: dependency.complianceStatus,
      artifactHash: dependency.artifactHash?.hash,
      complianceApprovedHash: dependency.complianceApprovedHash?.hash,
    },
  };
}
