// packages/code-analysis/src/language/typescript/scanners/symbols/class-symbol-scanner.ts

import type { SymbolDefinition } from './symbol-types.js';
import type { SourceUnit } from '../../source/source-unit.js';


export class ClassSymbolScanner {
  scan(source: SourceUnit): readonly SymbolDefinition[] {
    return source.getClasses().map((declaration) => ({
      id: declaration.symbolId,
      name: declaration.name,
      kind: 'class',
      sourceFile: source.path,
    }));
  }
}
