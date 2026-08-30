// packages/governance/src/rules/compliance/artifact-compliance-rule.ts

import { COMPLIANCE_RULE_ID } from '../../compliance/compliance-rule-id.js';
import type { ComplianceRuleResult } from '../../compliance/compliance-rule-result.js';
import type { ComplianceRule } from '../../compliance/compliance-rule.js';
import type { ComplianceExecutionContext } from '../../context/compliance-execution-context.js';
import type { ComplianceScope } from '../../public/compliance-scope.js';

import { ArtifactComplianceEvaluator } from './artifact-compliance-evaluator.js';

export class ArtifactComplianceRule implements ComplianceRule {
  readonly id = COMPLIANCE_RULE_ID.ArtifactCompliance;
  readonly name = 'artifact-compliance';

  constructor(private readonly evaluator: ArtifactComplianceEvaluator) {}

  supports(scope: ComplianceScope): boolean {
    return scope.kind === 'workspace' || scope.kind === 'package';
  }

  run(context: ComplianceExecutionContext): ComplianceRuleResult {
    return this.evaluator.evaluate(context);
  }
}
