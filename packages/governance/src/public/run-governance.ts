// packages/governance/src/public/run-governance.ts

import { GovernanceCompositionRoot } from '../composition/governance-composition-root.js';
import { buildGovernanceContext } from '../context/build-governance-context.js';
import type { GovernanceOptions } from '../public/governance-options.js';
import type { GovernanceResult } from '../public/governance-result.js';

export async function runGovernance(options: GovernanceOptions): Promise<GovernanceResult> {
  const {
    architectureProvider,
    workspaceProvider,
    artifactStateProvider,
    complianceStateProvider,
    createExecutionContext,
    engine,
    complianceEvaluator,
  } = new GovernanceCompositionRoot().create();
  const artifactStateReader = artifactStateProvider.createReader();
  const complianceStateReader = complianceStateProvider.createReader();
  const architecture = await architectureProvider.load(options.workspaceRoot);
  const workspace = await workspaceProvider.discover(options.workspaceRoot);
  const complianceStates = await complianceStateReader.read(workspace.root);
  const artifactStates = await artifactStateReader.read(workspace.root);

  const context = buildGovernanceContext(
    options,
    architecture,
    workspace,
    artifactStates,
    complianceStates,
  );
  const executionContext = await createExecutionContext(context);

  const result = await engine.run(executionContext);

  if (result.success) {
    const artifactStateWriter = artifactStateProvider.createWriter();

    const complianceStateWriter = complianceStateProvider.createWriter(
      options.workspaceRoot,
      executionContext.complianceStates,
    );

    const evaluation = complianceEvaluator.evaluate(executionContext);

    for (const change of evaluation.changes) {
      complianceStateWriter.apply(change);
    }

    await artifactStateWriter.write(options.workspaceRoot, executionContext.artifactStates);
    await complianceStateWriter.write();
  }

  return result;
}
