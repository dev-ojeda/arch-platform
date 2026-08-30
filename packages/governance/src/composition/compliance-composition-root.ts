// packages/governance/src/composition/compliance-composition-root.ts

import {
  ArtifactStateProvider,
  ComplianceStateProvider,
  NodeWorkspaceProvider,
} from '@arch/infrastructure';

import { ComplianceEngine } from '../compliance/compliance-engine.js';
import { ArtifactComplianceEvaluator } from '../rules/artifact/artifact-compliance-evaluator.js';
import { ArtifactComplianceRule } from '../rules/artifact/artifact-compliance-rule.js';

export class ComplianceCompositionRoot {
  create() {
    const artifactComplianceEvaluator = new ArtifactComplianceEvaluator();

    const rules = [new ArtifactComplianceRule(artifactComplianceEvaluator)];

    return {
      workspaceProvider: new NodeWorkspaceProvider(),
      artifactStateProvider: new ArtifactStateProvider(),
      complianceStateProvider: new ComplianceStateProvider(),

      engine: new ComplianceEngine(rules),
    };
  }
}
