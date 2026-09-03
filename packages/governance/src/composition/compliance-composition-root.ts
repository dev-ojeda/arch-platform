// packages/governance/src/composition/compliance-composition-root.ts

import {
  ArtifactStateProvider,
  ComplianceStateProvider,
  NodeWorkspaceProvider,
} from '@arch/infrastructure';

import { ComplianceEngine } from '../compliance/compliance-engine.js';
import { buildComplianceExecutionContext } from '../context/build-compliance-execution-context.js';
import type { ComplianceContext } from '../context/compliance-context.js';
import { InMemoryComplianceEventBus } from '../events/compliance-event-bus.js';
import { ArtifactComplianceEvaluator } from '../rules/artifact/artifact-compliance-evaluator.js';
import { ArtifactComplianceRule } from '../rules/artifact/artifact-compliance-rule.js';

export class ComplianceCompositionRoot {
  create() {
    const artifactComplianceEvaluator = new ArtifactComplianceEvaluator();
    const complianceEventBus = new InMemoryComplianceEventBus();
    const artifactStateReader = new ArtifactStateProvider().createReader();
    const complianceStateProvider = new ComplianceStateProvider();
    const complianceStateReader = complianceStateProvider.createReader();
    const rules = [new ArtifactComplianceRule(artifactComplianceEvaluator)];

    return {
      workspaceProvider: new NodeWorkspaceProvider(),
      complianceStateProvider,
      artifactStateReader,
      complianceStateReader,
      createComplianceExecutionContext: (context: ComplianceContext) =>
        buildComplianceExecutionContext(context),
      complianceEventBus,
      engine: new ComplianceEngine(rules, complianceEventBus),
    };
  }
}
