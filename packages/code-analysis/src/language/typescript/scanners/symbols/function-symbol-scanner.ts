// packages/code-analysis/src/language/typescript/scanners/symbols/function-symbol-scanner.ts

import type { SymbolDefinition } from './symbol-types.js';
import type { SourceUnit } from '../../source/source-unit.js';


export class FunctionSymbolScanner {
  scan(source: SourceUnit): readonly SymbolDefinition[] {
    return source.getFunctions().map((declaration) => ({
      id: declaration.symbolId,
      name: declaration.name,
      kind: 'function',
      sourceFile: source.path,
    }));
  }
}
