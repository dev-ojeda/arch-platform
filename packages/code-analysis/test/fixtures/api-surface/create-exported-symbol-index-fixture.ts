// test/fixtures/api-surface/create-exported-symbol-index-fixture.ts

import { DefaultExportedSymbolIndexBuilder } from '../../../src/api-surface/default-exported-symbol-index-builder.js';
import type { ExportedSymbolIndex } from '../../../src/api-surface/exported-symbol-index.js';
import type { SourceReader } from '../../../src/language/typescript/source/source-reader.js';

export function createExportedSymbolIndexFixture(sourceReader: SourceReader): ExportedSymbolIndex {
  return new DefaultExportedSymbolIndexBuilder().build(sourceReader);
}
