// packages/code-analysis/src/module/model/module-descriptor.ts

import type { ModuleExport } from './module-export.js';
import type { ModuleReference } from './module-reference.js';

export interface ModuleDescriptor {
  readonly filePath: string;
  readonly imports: readonly ModuleReference[];
  readonly exports: readonly ModuleExport[];
}
