// packages/governance/src/rules/dependency-layer-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceContext } from '../context/governance-context.js';
import { DependencyRulesEngine } from '../engine/dependency-rules.engine.js';
import { GOVERNANCE_RULE_ID } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { GovernanceScope } from '../public/governance-scope.js';

export class DependencyLayerRule implements GovernanceRule {
  readonly id = GOVERNANCE_RULE_ID.DependencyLayer;
  readonly name = 'dependency-layer-rule';
  private readonly engine = new DependencyRulesEngine();

  run(context: GovernanceContext): Diagnostic[] {
    return this.engine.run(context);
  }
  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'workspace';
  }
}
