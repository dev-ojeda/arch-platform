import { createSymbolScanner } from '../../../src/language/create-symbol-scanner.js';
import type { SymbolScanner } from '../../../src/language/typescript/scanners/symbols/symbol-scanner.js';

import { createSourceReader } from './create-source-reader-fixture.js';

export function createSymbolScannerFixture(tsconfig: string): SymbolScanner {
  return createSymbolScanner(createSourceReader(tsconfig));
}
