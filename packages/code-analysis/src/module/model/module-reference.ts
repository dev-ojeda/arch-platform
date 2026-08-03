// packages/code-analysis/src/module/model/module-reference.ts

import type { ModuleKind } from './module-kind.js';

export interface ModuleReference {
  readonly sourceFile: string;

  readonly moduleSpecifier: string;

  readonly kind: ModuleKind;

  readonly packageName?: string;

  readonly targetFile?: string;
}
