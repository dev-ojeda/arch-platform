// packages/governance/src/rules/dependency-layer-rule.ts

import { GovernanceRuleId } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { Diagnostic } from '../types/diagnostic.js';
import type { GovernanceContext } from '../types/governance-context.js';

import { DependencyRulesEngine } from './dependency-rules.engine.js';

export class DependencyLayerRule implements GovernanceRule {
  readonly id = GovernanceRuleId.DependencyLayer;
  readonly name = 'dependency-layer-rule';
  private readonly engine = new DependencyRulesEngine();

  async run(context: GovernanceContext): Promise<Diagnostic[]> {
    return Promise.resolve(this.engine.run(context));
  }
}
