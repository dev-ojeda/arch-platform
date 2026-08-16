// packages/code-analysis/src/module/model/module-export.ts

import type { ModuleKind } from './module-kind.js';

export interface ModuleExport {
  readonly sourceFile: string;

  readonly moduleSpecifier: string;

  readonly isTypeOnly: boolean;

  readonly exportedName?: string;

  readonly localName?: string;

  readonly kind: ModuleKind;

  readonly packageName?: string;
}
