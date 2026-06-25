// packages/code-analysis/src/symbol-dependencies/semantic-dependency-analyzer.ts

import type { Project } from 'ts-morph';

import { buildSymbolGraph } from '../symbol-graph/build-symbol-graph.js';

import type { PackageDependencyGraphBuilder } from './package-dependency-graph-builder.js';
import type { PackageDependencyGraph } from './package-dependency-graph.js';

export class SemanticDependencyAnalyzer {
  constructor(private readonly graphBuilder: PackageDependencyGraphBuilder) {}
  analyze(project: Project): PackageDependencyGraph {
    const graph = buildSymbolGraph(project);

    return this.graphBuilder.build(graph);
  }
}
