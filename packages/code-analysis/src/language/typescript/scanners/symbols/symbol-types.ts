// packages/code-analysis/src/language/typescript/symbols/symbol-types.ts

import type { SymbolKind } from '../../../../public/symbol-kind.js';

export interface SymbolDefinition {
  readonly id: string;

  readonly name: string;

  readonly kind: SymbolKind;

  readonly sourceFile: string;
}
