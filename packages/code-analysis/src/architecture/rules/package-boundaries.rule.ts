// packages/code-analysis/src/architecture/rules/package-boundaries.rule.ts

import type { SymbolGraph } from '../../symbol-graph/symbol-graph-types.js';
import type { ArchitectureRuleResult, ArchitectureViolation } from '../architecture-rule-result.js';
import type { ArchitectureRule } from '../architecture-rule.js';

export interface PackageBoundaryPolicy {
  readonly [packageName: string]: readonly string[];
}

export class PackageBoundariesRule implements ArchitectureRule {
  readonly id = 'package-boundaries';

  readonly description = 'Validate package dependency boundaries';

  constructor(private readonly policy: PackageBoundaryPolicy) {}

  validate(graph: SymbolGraph): ArchitectureRuleResult {
    const violations: ArchitectureViolation[] = [];

    for (const edge of graph.edges) {
      const from = graph.nodes.find((node) => node.id === edge.from);

      const to = graph.nodes.find((node) => node.id === edge.to);

      if (!from || !to) {
        continue;
      }

      const allowed = this.policy[from.package] ?? [];

      if (!allowed.includes(to.package)) {
        violations.push({
          fromPackage: from.package,

          toPackage: to.package,

          symbol: from.name,

          message: `Package ${from.package} cannot depend on ${to.package}`,
        });
      }
    }

    return {
      ruleId: this.id,

      passed: violations.length === 0,

      violations,
    };
  }
}
