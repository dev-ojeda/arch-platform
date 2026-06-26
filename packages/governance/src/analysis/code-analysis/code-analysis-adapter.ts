// code-analysis-adapter.ts

import {
  buildSymbolGraph,
  createTsProject,
  PackageDependencyGraphBuilder,
  SemanticDependencyAnalyzer,
} from '@arch/code-analysis';

import type {
  GovernanceAnalysisContext,
  GovernanceContext,
} from '../../types/governance-context.js';

export class CodeAnalysisAdapter {
  constructor(
    private readonly analyzer = new SemanticDependencyAnalyzer(new PackageDependencyGraphBuilder()),
  ) {}

  async analyze(
    context: GovernanceContext,
    tsConfigFilePath: string,
  ): Promise<GovernanceAnalysisContext> {
    const project = createTsProject({
      tsConfigFilePath,
    });

    return Promise.resolve({
      symbolGraph: buildSymbolGraph(project),
      packageGraph: this.analyzer.analyze(project),
    });
  }
}
