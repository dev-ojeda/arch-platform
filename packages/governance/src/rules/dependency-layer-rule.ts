// packages/governance/src/rules/dependency-layer-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceContext } from '../context/governance-context.js';
import type { GovernanceScope } from '../context/governance-scope.js';
import { DependencyRulesEngine } from '../engine/dependency-rules.engine.js';
import { GovernanceRuleId } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';

export class DependencyLayerRule implements GovernanceRule {
  readonly id = GovernanceRuleId.DependencyLayer;
  readonly name = 'dependency-layer-rule';
  private readonly engine = new DependencyRulesEngine();

  run(context: GovernanceContext): Diagnostic[] {
    return this.engine.run(context);
  }
  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'workspace';
  }
}
