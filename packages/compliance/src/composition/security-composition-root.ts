// packages/compliance/src/composition/security-composition-root.ts

import {
  CVEAdvisoryProvider,
  DependencyLockfileProvider,
  NodeArchitectureProvider,
  NodeWorkspaceProvider,
  SecurityStateProvider,
} from '@arch-platform/infrastructure';

import { DefaultSecurityEvaluator } from '../security/default-security-evaluator.js';
import { SecurityVulnerabilityMatcher } from '../security/security-vulnerability-matcher.js';

export class SecurityCompositionRoot {
  create() {
    const securityStateProvider = new SecurityStateProvider();
    const cveAdvisoryProvider = new CVEAdvisoryProvider();
    const dependencyLockfileProvider = new DependencyLockfileProvider();

    return {
      workspaceProvider: new NodeWorkspaceProvider(),
      architectureProvider: new NodeArchitectureProvider(),
      securityStateProvider,
      securityStateReader: securityStateProvider.createReader(),
      complianceArtifactReader: securityStateProvider.createComplianceArtifactReader(),
      cveAdvisoryProvider,
      dependencyLockfileProvider,
      securityEvaluator: new DefaultSecurityEvaluator(new SecurityVulnerabilityMatcher()),
    };
  }
}
