// packages/code-analysis/src/architecture/architecture-rule-engine.ts

import type { SymbolGraph } from '../symbol-graph/symbol-graph-types.js';

import type { ArchitectureRuleResult } from './architecture-rule-result.js';
import type { ArchitectureRule } from './architecture-rule.js';

export class ArchitectureRuleEngine {
  constructor(private readonly rules: readonly ArchitectureRule[]) {}

  analyze(graph: SymbolGraph): readonly ArchitectureRuleResult[] {
    return this.rules.map((rule) => rule.validate(graph));
  }
}
