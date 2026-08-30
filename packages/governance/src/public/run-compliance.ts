// packages/governance/src/public/run-compliance.ts

import { ComplianceCompositionRoot } from '../composition/compliance-composition-root.js';
import { buildComplianceContext } from '../context/build-compliance-context.js';
import { buildComplianceExecutionContext } from '../context/build-compliance-execution-context.js';
import { createStopwatch } from '../helpers/create-stopwatch.js';

import type { ComplianceOptions } from './compliance-options.js';
import type { ComplianceResult } from './compliance-result.js';

export async function runCompliance(options: ComplianceOptions): Promise<ComplianceResult> {
  const stopwatch = createStopwatch();

  const { workspaceProvider, artifactStateProvider, complianceStateProvider, engine } =
    new ComplianceCompositionRoot().create();

  const workspace = await workspaceProvider.discover(options.workspaceRoot);

  const artifactStateReader = artifactStateProvider.createReader();
  const complianceStateReader = complianceStateProvider.createReader();

  const artifactStates = await artifactStateReader.read(workspace.root);
  const complianceStates = await complianceStateReader.read(workspace.root);

  const complianceContext = buildComplianceContext(
    options,
    workspace,
    artifactStates,
    complianceStates,
  );

  const executionContext = buildComplianceExecutionContext(complianceContext);

  const evaluation = await engine.run(executionContext);

  const complianceStateWriter = complianceStateProvider.createWriter(
    options.workspaceRoot,
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
