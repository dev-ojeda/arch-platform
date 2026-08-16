// packages/code-analysis/src/api-surface/exported-symbol-index-builder.ts

import type { SourceReader } from '../language/index.js';
import type { PackageResolver } from '../package/resolvers/package-resolver.js';
import type { ExportedSymbolIndex } from '../public/exported-symbol-index.js';

export interface ExportedSymbolIndexBuilder {
  build(sourceReader: SourceReader, packageResolver: PackageResolver): ExportedSymbolIndex;
}
