// packages/code-analysis/src/package/dependency/package-dependency-graph-builder.ts

import type { SymbolGraph } from '../../public/symbol-graph.js';

import type { PackageDependencyGraph } from './package-dependency-graph.js';

export class PackageDependencyGraphBuilder {
  build(graph: SymbolGraph): PackageDependencyGraph {
    const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));

    const dependencies = new Map<
      string,
      {
        fromPackage: string;
        toPackage: string;
        symbols: Set<string>;
      }
    >();

    for (const edge of graph.edges) {
      const fromNode = nodesById.get(edge.from);
      const toNode = nodesById.get(edge.to);

      if (!fromNode || !toNode) {
        continue;
      }

      if (fromNode.package === toNode.package) {
        continue;
      }

      const key = `${fromNode.package}->${toNode.package}`;

      const dependency = dependencies.get(key) ?? {
        fromPackage: fromNode.package,
        toPackage: toNode.package,
        symbols: new Set<string>(),
      };

      dependency.symbols.add(toNode.name);

      dependencies.set(key, dependency);
    }

    return {
      dependencies: Array.from(dependencies.values()).map((dependency) => ({
        fromPackage: dependency.fromPackage,
        toPackage: dependency.toPackage,
        symbols: Array.from(dependency.symbols).sort(),
      })),
    };
  }
}
