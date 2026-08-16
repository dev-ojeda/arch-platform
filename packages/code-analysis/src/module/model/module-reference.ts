// packages/code-analysis/src/module/model/module-reference.ts

import type { ImportedSymbolReference } from './imported-symbol-reference.js';
import type { ModuleKind } from './module-kind.js';

export interface ModuleReference {
  readonly sourceFile: string;

  readonly moduleSpecifier: string;

  readonly isTypeOnly: boolean;

  readonly kind: ModuleKind;

  readonly packageName?: string;

  readonly targetFile?: string;

  readonly symbols: readonly ImportedSymbolReference[];
}
