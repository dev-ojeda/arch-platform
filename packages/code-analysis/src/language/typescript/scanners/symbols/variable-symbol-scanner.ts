// packages/code-analysis/src/language/typescript/scanners/symbols/variable-symbol-scanner.ts

import type { SymbolDefinition } from './symbol-types.js';
import type { SourceUnit } from '../../source/source-unit.js';


export class VariableSymbolScanner {
  scan(source: SourceUnit): readonly SymbolDefinition[] {
    return source.getVariables().map((declaration) => ({
      id: declaration.symbolId,
      name: declaration.name,
      kind: 'variable',
      sourceFile: source.path,
    }));
  }
}
