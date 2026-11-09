// packages/code-analysis/src/language/typescript/scanners/symbols/enum-symbol-scanner.ts

import type { SymbolDefinition } from './symbol-types.js';
import type { SourceUnit } from '../../source/source-unit.js';


export class EnumSymbolScanner {
  scan(source: SourceUnit): readonly SymbolDefinition[] {
    return source.getEnums().map((declaration) => ({
      id: declaration.symbolId,
      name: declaration.name,
      kind: 'enum',
      sourceFile: source.path,
    }));
  }
}
