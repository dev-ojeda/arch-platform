// packages/governance/src/public/run-compliance.ts

import { ComplianceCompositionRoot } from '../composition/compliance-composition-root.js';
import { buildComplianceContext } from '../context/build-compliance-context.js';
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

  const evaluation = await engine.run(executionContext);
  const complianceStateWriter = complianceStateProvider.createWriter(
    executionContext.workspace.root,
    executionContext.complianceStates,
  );

  for (const change of evaluation.changes) {
    complianceStateWriter.apply(change);
  }

  await complianceStateWriter.write();

  return {
    success: evaluation.diagnostics.length === 0,
    diagnostics: evaluation.diagnostics,
    durationMs: stopwatch.milliseconds(),
    changes: evaluation.changes.length,
    executions: evaluation.executions,
    scope: executionContext.scope,
  };
}
