// packages/code-analysis/src/module/model/resolved-module.ts

import type { ModuleReference } from './module-reference.js';

export interface ResolvedModuleReference extends ModuleReference {
  readonly targetFile?: string;

  readonly targetPackage?: string;
}
