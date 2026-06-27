// packages/code-analysis/src/architecture/rules/no-circular-dependencies.rule.ts

import type { SymbolGraph } from '../../symbol-graph/symbol-graph-types.js';
import type { ArchitectureRuleResult, ArchitectureViolation } from '../architecture-rule-result.js';
import type { ArchitectureRule } from '../architecture-rule.js';

export class NoCircularDependenciesRule implements ArchitectureRule {
  readonly id = 'no-circular-dependencies';

  readonly description = 'Detect circular dependencies between packages';

  validate(graph: SymbolGraph): ArchitectureRuleResult {
    const violations: ArchitectureViolation[] = [];

    const adjacency = this.buildPackageGraph(graph);

    const visited = new Set<string>();

    const stack = new Set<string>();

    for (const pkg of adjacency.keys()) {
      this.detectCycle(pkg, adjacency, visited, stack, violations);
    }

    return {
      ruleId: this.id,

      passed: violations.length === 0,

      violations,
    };
  }

  private buildPackageGraph(graph: SymbolGraph): Map<string, Set<string>> {
    const result = new Map<string, Set<string>>();

    for (const edge of graph.edges) {
      const from = graph.nodes.find((node) => node.id === edge.from);

      const to = graph.nodes.find((node) => node.id === edge.to);

      if (!from || !to) {
        continue;
      }

      const dependencies = result.get(from.package);

      if (dependencies) {
        dependencies.add(to.package);
      } else {
        result.set(from.package, new Set([to.package]));
      }
    }

    return result;
  }

  private detectCycle(
    current: string,
    graph: Map<string, Set<string>>,
    visited: Set<string>,
    stack: Set<string>,
    violations: ArchitectureViolation[],
  ): void {
    if (stack.has(current)) {
      violations.push({
        fromPackage: current,

        toPackage: current,

        message: `Circular dependency detected involving ${current}`,
      });

      return;
    }

    if (visited.has(current)) {
      return;
    }

    visited.add(current);

    stack.add(current);

    const dependencies: ReadonlySet<string> = graph.get(current) ?? new Set<string>();

    for (const next of dependencies) {
      this.detectCycle(next, graph, visited, stack, violations);
    }

    stack.delete(current);
  }
}
