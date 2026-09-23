// packages/compliance/src/public/runSecurity.ts

import { getSecurityConfig } from '@arch-platform/infrastructure';

import { SecurityCompositionRoot } from '../composition/security-composition-root.js';
import { buildComplianceSecurityContext } from '../context/build-compliance-security-context.js';
import { buildComplianceSecurityExecutionContext } from '../context/build-compliance-security-execution-context.js';
import { DependencyGraphBuilder } from '../dependency/dependency-graph-builder.js';
import { DependencyLockfileQuery } from '../dependency/dependency-lock-file-query.js';
import { createStopwatch } from '../helpers/create-stopwatch.js';
import type { SecurityOptions } from '../security/security-options.js';

import { resolveSecurityAction } from './resolved-security-action.js';
import type { SecurityResult } from './security-result.js';

export async function runSecurity(options: SecurityOptions): Promise<SecurityResult> {
  const stopwatch = createStopwatch();

  const {
    workspaceProvider,
    architectureProvider,
    complianceArtifactReader,
    securityStateReader,
    securityStateProvider,
    cveAdvisoryProvider,
    dependencyLockfileProvider,
    securityEvaluator,
  } = new SecurityCompositionRoot().create();

  const config = getSecurityConfig(options.lockfilePath);

  const workspace = await workspaceProvider.discover(options.workspaceRoot);
  const architecture = await architectureProvider.load(workspace.root);
  const cveAdvisoryReader = cveAdvisoryProvider.createReader(workspace.root);
  const dependencyLockfileReader = dependencyLockfileProvider.createReader(workspace.root);
  const advisories = await cveAdvisoryReader.read(workspace.root, config.advisoryPath);
  const lockfile = await dependencyLockfileReader.read(workspace.root, config.lockfilePath);
  const securityContext = await buildComplianceSecurityContext(
    options,
    workspace,
    securityStateReader,
    complianceArtifactReader,
    lockfile,
    advisories,
  );
  if (securityContext.scope.kind !== 'package') {
    throw new Error('Workspace security evaluation is not implemented yet.');
  }
  const query = new DependencyLockfileQuery(securityContext.dependencyLockfile);

  const builder = new DependencyGraphBuilder(query, architecture);

  const graph = builder.build(securityContext.scope.packageName);

  const securityExecutionContext = buildComplianceSecurityExecutionContext(securityContext, graph);

  const changes = await securityEvaluator.evaluate(securityExecutionContext);

  const securityStateWriter = securityStateProvider.createWriter(
    securityContext.scope.root,
    securityContext.securityStates,
  );

  for (const change of changes.changes) {
    securityStateWriter.apply(change);
  }

  await securityStateWriter.write();
  const change = changes.changes[0];

  if (!change) {
    throw new Error('Security evaluation produced no state change.');
  }

  return {
    success: true,
    changes: changes.changes.length,
    durationMs: stopwatch.milliseconds(),
    artifact: change.artifact,
    previousStatus: change.previousStatus,
    evaluationStatus: change.evaluation.status,
    decisionStatus: change.decision.status,
    securityAction: resolveSecurityAction(change),
  };
}
