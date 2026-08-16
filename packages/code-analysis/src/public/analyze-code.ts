// packages/code-analysis/src/public/analyze-code.ts

import { DefaultExportedSymbolIndexBuilder } from '../api-surface/default-exported-symbol-index-builder.js';
import type { AnalysisRequest } from '../application/analysis-request.js';
import { SymbolGraphBuilder } from '../graph/symbol-graph-builder.js';
import { createReferenceAnalyzer } from '../language/create-reference-analyzer.js';
import { createSymbolScanner } from '../language/create-symbol-scanner.js';
import { createTypeScriptLanguage } from '../language/create-typescript-language.js';
import { createTypeScriptProjectLoader } from '../language/create-typescript-project-loader.js';
import { buildModuleAnalysis } from '../module/build-module-analysis.js';
import { PackageDependencyAnalyzer } from '../package/dependency/package-dependency-analyzer.js';
import { PackageDependencyGraphBuilder } from '../package/dependency/package-dependency-graph-builder.js';
import { DefaultPackageResolver } from '../package/resolvers/default-package-resolver.js';
import type { AnalysisContext } from '../public/analysis-context.js';

export function analyzeCode(request: AnalysisRequest): AnalysisContext {
  const packageResolver = new DefaultPackageResolver();

  const project = createTypeScriptProjectLoader({
    tsConfigFilePath: request.tsConfigFilePath,
  });

  const sourceReader = createTypeScriptLanguage(project);

  const exportedSymbols = new DefaultExportedSymbolIndexBuilder().build(
    sourceReader,
    packageResolver,
  );

  const referenceAnalyzer = createReferenceAnalyzer(sourceReader);
  const symbolScanner = createSymbolScanner(sourceReader);

  const symbolGraph = new SymbolGraphBuilder(
    symbolScanner,
    referenceAnalyzer,
    packageResolver,
  ).build();

  const dependencyAnalyzer = new PackageDependencyAnalyzer(new PackageDependencyGraphBuilder());

  return {
    modules: buildModuleAnalysis(sourceReader, packageResolver),
    symbolGraph,
    packageGraph: dependencyAnalyzer.analyze(symbolGraph),
    exportedSymbols,
  };
}
