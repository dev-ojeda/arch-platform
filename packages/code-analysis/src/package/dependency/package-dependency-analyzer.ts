// packages/code-analysis/src/package/dependency/package-dependency-analyzer.ts


import { buildSymbolGraph } from '../../symbols/graph/build-symbol-graph.js';

import type { PackageDependencyGraphBuilder } from './package-dependency-graph-builder.js';
import type { PackageDependencyGraph } from './package-dependency-graph.js';
import type { PackageResolver } from '../resolvers/package-resolver.js';
import type { Project } from 'ts-morph';

export class PackageDependencyAnalyzer {
  constructor(
    private readonly graphBuilder: PackageDependencyGraphBuilder,
    private readonly packageResolver: PackageResolver,
  ) {}

  analyze(project: Project): PackageDependencyGraph {
    const symbolGraph = buildSymbolGraph(project, this.packageResolver);

    return this.graphBuilder.build(symbolGraph);
  }
}
