// packages/governance/src/public/run-compliance.ts

import { ComplianceCompositionRoot } from '../composition/compliance-composition-root.js';
import { buildComplianceContext } from '../context/build-compliance-context.js';
import { resolveComplianceAction } from '../diagnostics/resolved-compliance-action.js';
import { createStopwatch } from '../helpers/create-stopwatch.js';

import type { ComplianceOptions } from './compliance-options.js';
import type { ComplianceResult } from './compliance-result.js';

export async function runCompliance(options: ComplianceOptions): Promise<ComplianceResult> {
  const stopwatch = createStopwatch();

  const {
    workspaceProvider,
    complianceStateProvider,
    artifactStateReader,
    complianceStateReader,
    createComplianceExecutionContext,
    complianceEventBus,
    engine,
  } = new ComplianceCompositionRoot().create();
  const workspace = await workspaceProvider.discover(options.workspaceRoot);

  const complianceContext = await buildComplianceContext(
    options,
    workspace,
    artifactStateReader,
    complianceStateReader,
  );

  const executionContext = createComplianceExecutionContext(complianceContext);
  await complianceEventBus.publish({
    name: 'COMPLIANCE_STARTED',
    timestamp: Date.now(),
  });
  const evaluation = await engine.run(executionContext);
  const action = resolveComplianceAction(evaluation.changes, evaluation.diagnostics);
  const complianceStateWriter = complianceStateProvider.createWriter(
    executionContext.workspace.root,
    executionContext.complianceStates,
    executionContext.environment,
  );

  for (const change of evaluation.changes) {
    complianceStateWriter.apply(change);
  }

  await complianceStateWriter.write();

  const success = !evaluation.diagnostics.some((diagnostic) => diagnostic.severity === 'error');

  await complianceEventBus.publish({
    name: success ? 'COMPLIANCE_COMPLETED' : 'COMPLIANCE_FAILED',
    timestamp: Date.now(),
  });

  return {
    success,
    diagnostics: evaluation.diagnostics,
    durationMs: stopwatch.milliseconds(),
    changes: evaluation.changes.length,
    executions: evaluation.executions,
    scope: executionContext.scope,
    action,
  };
}
