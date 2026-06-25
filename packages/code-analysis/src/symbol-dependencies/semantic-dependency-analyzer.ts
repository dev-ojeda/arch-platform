// packages/code-analysis/src/symbol-dependencies/semantic-dependency-analyzer.ts

import type { Project } from 'ts-morph';

import type { PackageDependencyGraphBuilder } from './package-dependency-graph-builder.js';
import type { PackageDependencyGraph } from './package-dependency-graph.js';
import { SemanticDependencyScanner } from './semantic-dependency-scanner.js';

export class SemanticDependencyAnalyzer {
  constructor(private readonly graphBuilder: PackageDependencyGraphBuilder) {}

  analyze(project: Project): PackageDependencyGraph {
    const graph = new SemanticDependencyScanner().scan(project);

    return this.graphBuilder.build(graph);
  }
}
