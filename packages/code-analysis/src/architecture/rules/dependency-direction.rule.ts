// packages/code-analysis/src/architecture/rules/dependency-direction.rule.ts

import type { SymbolGraph } from '../../symbol-graph/symbol-graph-types.js';
import type { ArchitectureRuleResult, ArchitectureViolation } from '../architecture-rule-result.js';
import type { ArchitectureRule } from '../architecture-rule.js';

export interface DependencyDirectionPolicy {
  readonly layers: readonly string[];
}

export class DependencyDirectionRule implements ArchitectureRule {
  readonly id = 'dependency-direction';

  readonly description = 'Validate dependency direction between architectural layers';

  constructor(private readonly policy: DependencyDirectionPolicy) {}

  validate(graph: SymbolGraph): ArchitectureRuleResult {
    const violations: ArchitectureViolation[] = [];

    const layerIndex = new Map(this.policy.layers.map((layer, index) => [layer, index]));

    for (const edge of graph.edges) {
      const from = graph.nodes.find((node) => node.id === edge.from);
      const to = graph.nodes.find((node) => node.id === edge.to);

      if (!from || !to) {
        continue;
      }

      const fromLayer = layerIndex.get(from.package);
      const toLayer = layerIndex.get(to.package);

      // Si alguno de los packages no participa en la política,
      // esta regla simplemente lo ignora.
      if (fromLayer === undefined || toLayer === undefined) {
        continue;
      }

      // Se permite depender de la misma capa o de una capa inferior.
      if (fromLayer > toLayer) {
        violations.push({
          fromPackage: from.package,
          toPackage: to.package,
          symbol: from.name,
          message: `Dependency direction violation: "${from.package}" cannot depend on "${to.package}".`,
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
