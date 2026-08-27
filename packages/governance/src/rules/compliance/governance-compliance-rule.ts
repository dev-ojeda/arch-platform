// packages/governance/src/rules/compliance/governance-compliance-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceExecutionContext } from '../../context/governance-context.js';
import { GOVERNANCE_RULE_ID } from '../../engine/governance-rule-id.js';
import type { GovernanceRule } from '../../engine/governance-rule.js';
import type { GovernanceScope } from '../../public/governance-scope.js';

import type { GovernanceComplianceEvaluation } from './governance-compliance-evaluation.js';
import { GovernanceComplianceEvaluator } from './governance-compliance-evaluator.js';

export class GovernanceComplianceRule implements GovernanceRule<GovernanceExecutionContext> {
  readonly id = GOVERNANCE_RULE_ID.GovernanceComplianceRule;
  readonly name = 'governance-compliance-rule';

  private lastEvaluation?: GovernanceComplianceEvaluation;

  constructor(private readonly evaluator: GovernanceComplianceEvaluator) {}

  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'workspace' || scope.kind === 'package';
  }

  run(context: GovernanceExecutionContext): Diagnostic[] {
    const evaluation = this.evaluator.evaluate(context);

    this.lastEvaluation = evaluation;

    return [...evaluation.diagnostics];
  }

  getLastEvaluation(): GovernanceComplianceEvaluation | undefined {
    return this.lastEvaluation;
  }
}
