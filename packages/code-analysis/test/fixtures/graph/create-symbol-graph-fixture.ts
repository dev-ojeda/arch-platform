// packages\code-analysis\test\fixtures\graph\create-symbol-graph-fixture.ts
import type { SymbolGraph } from '@arch/code-analysis';

import { SymbolGraphBuilder } from '../../../src/graph/symbol-graph-builder.js';
import { createReferenceAnalyzer } from '../../../src/language/create-reference-analyzer.js';
import { createSymbolScanner } from '../../../src/language/create-symbol-scanner.js';
import { DefaultPackageResolver } from '../../../src/package/resolvers/default-package-resolver.js';
import { createSourceReader } from '../language/create-source-reader-fixture.js';

export function createSymbolGraphFixture(code: string): SymbolGraph {
  const sourceReader = createSourceReader(code);
  const scanner = createSymbolScanner(sourceReader);
  const analyzer = createReferenceAnalyzer(sourceReader);

  return new SymbolGraphBuilder(scanner, analyzer, new DefaultPackageResolver()).build();
}
