// packages/code-analysis/src/language/typescript/scanners/symbols/symbol-scanner.ts


import type { SymbolMetadataScanner } from './symbol-metadata-scanner.js';
import type { SymbolDefinition } from './symbol-types.js';
import type { SourceReader } from '../../source/source-reader.js';

export class SymbolScanner {
  constructor(
    private readonly sourceReader: SourceReader,
    private readonly scanners: readonly SymbolMetadataScanner[],
  ) {}

  scan(): readonly SymbolDefinition[] {
    const symbols: SymbolDefinition[] = [];

    for (const source of this.sourceReader.getSources()) {
      for (const scanner of this.scanners) {
        symbols.push(...scanner.scan(source));
      }
    }

    return symbols;
  }
}
