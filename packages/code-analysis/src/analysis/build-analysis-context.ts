// packages/code-analysis/src/analysis/build-analysis-context.ts

import type { Project } from 'ts-morph';

import { DefaultExportedSymbolIndexBuilder } from '../exports/default-exported-symbol-index-builder.js';
import { PackageDependencyAnalyzer } from '../package/dependency/package-dependency-analyzer.js';
import { PackageDependencyGraphBuilder } from '../package/dependency/package-dependency-graph-builder.js';
import { DefaultPackageResolver } from '../package/resolvers/default-package-resolver.js';
import { buildSymbolGraph } from '../symbols/graph/build-symbol-graph.js';

import type { AnalysisContext } from './analysis-context.js';

export function buildAnalysisContext(project: Project): AnalysisContext {
  const packageResolver = new DefaultPackageResolver();

  const dependencyAnalyzer = new PackageDependencyAnalyzer(
    new PackageDependencyGraphBuilder(),
    packageResolver,
  );

  return {
    project,
    symbolGraph: buildSymbolGraph(project, packageResolver),
    packageGraph: dependencyAnalyzer.analyze(project),
    exportedSymbols: new DefaultExportedSymbolIndexBuilder().build(project),
  };
}
