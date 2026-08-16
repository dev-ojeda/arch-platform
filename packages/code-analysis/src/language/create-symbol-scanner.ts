// packages/code-analysis/src/language/create-symbol-scanner.ts

import { ClassSymbolScanner } from './typescript/scanners/symbols/class-symbol-scanner.js';
import { EnumSymbolScanner } from './typescript/scanners/symbols/enum-symbol-scanner.js';
import { FunctionSymbolScanner } from './typescript/scanners/symbols/function-symbol-scanner.js';
import { InterfaceSymbolScanner } from './typescript/scanners/symbols/interface-symbol-scanner.js';
import { SymbolScanner } from './typescript/scanners/symbols/symbol-scanner.js';
import { VariableSymbolScanner } from './typescript/scanners/symbols/variable-symbol-scanner.js';
import type { SourceReader } from './typescript/source/source-reader.js';

export function createSymbolScanner(sourceReader: SourceReader): SymbolScanner {
  return new SymbolScanner(sourceReader, [
    new ClassSymbolScanner(),
    new InterfaceSymbolScanner(),
    new FunctionSymbolScanner(),
    new EnumSymbolScanner(),
    new VariableSymbolScanner(),
  ]);
}
