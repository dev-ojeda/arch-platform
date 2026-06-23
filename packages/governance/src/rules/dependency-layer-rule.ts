// packages/governance/src/rules/dependency-layer-rule.ts

import type { Diagnostic } from '../diagnostics/diagnostic.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { GovernanceContext } from '../types/governance-context.js';

import { DependencyRulesEngine } from './dependency-rules.engine.js';

export class DependencyLayerRule implements GovernanceRule {
  readonly name = 'dependency-layer-rule';
  private readonly engine = new DependencyRulesEngine();

  async run(context: GovernanceContext): Promise<Diagnostic[]> {
    return Promise.resolve(this.engine.run(context));
  }
}
