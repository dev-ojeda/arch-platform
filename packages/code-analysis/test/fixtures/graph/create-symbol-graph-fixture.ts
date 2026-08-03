import { SymbolGraphBuilder } from '../../../src/graph/symbol-graph-buikder.js';
import type { SymbolGraph } from '../../../src/graph/symbol-graph-types.js';
import { createReferenceAnalyzer } from '../../../src/language/create-reference-analyzer.js';
import { createSymbolScanner } from '../../../src/language/create-symbol-scanner.js';
import { DefaultPackageResolver } from '../../../src/package/resolvers/default-package-resolver.js';
import { createExportedSymbolIndexFixture } from '../api-surface/create-exported-symbol-index-fixture.js';
import { createSourceReader } from '../lenguage/create-source-reader-fixture.js';

export function createSymbolGraphFixture(code: string): SymbolGraph {
  const sourceReader = createSourceReader(code);
  const scanner = createSymbolScanner(sourceReader);
  const analyzer = createReferenceAnalyzer(sourceReader);
  const exportedSymbols = createExportedSymbolIndexFixture(sourceReader);

  return new SymbolGraphBuilder(scanner, analyzer, new DefaultPackageResolver()).build(
    exportedSymbols,
  );
}
