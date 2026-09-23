// packages\compliance\test\fixture\create-security-execution-context.ts

import type {
  DependencyGraph,
  SecurityAdvisory,
  SecurityDecisionStatus,
  SecurityExecutionContext,
} from '@arch-platform/platform-model';

import { dependencyGraphFixture } from './create-dependency-graph.js';
import { securityAdvisoryFixtures } from './create-security-advisory.js';

interface CreateSecurityExecutionContextOptions {
  readonly packageName?: string;
  readonly artifactHash?: string;
  readonly complianceStatus?: string;
  readonly previousSecurityStatus?: SecurityDecisionStatus;
  readonly dependencyGraph?: DependencyGraph;
  readonly advisories?: readonly SecurityAdvisory[];
}

export function createSecurityExecutionContext(
  options: CreateSecurityExecutionContextOptions = {},
): SecurityExecutionContext {
  return {
    packageName: options.packageName ?? '@arch-platform/code-analysis',
    artifactHash: options.artifactHash ?? 'sha256:H1',
    complianceStatus: options.complianceStatus ?? 'approved',
    previousSecurityStatus: options.previousSecurityStatus,
    dependencyGraph: options.dependencyGraph ?? dependencyGraphFixture,
    advisories: options.advisories ?? securityAdvisoryFixtures,
  };
}
