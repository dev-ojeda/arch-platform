// packages/code-analysis/src/module/model/module-descriptor.ts

import type { ModuleExportDeclaration } from './module-export-declaration.js';
import type { ModuleExport } from './module-export.js';
import type { ModuleReference } from './module-reference.js';

export interface ModuleDescriptor {
  readonly filePath: string;
  readonly imports: readonly ModuleReference[];
  readonly exports: readonly ModuleExport[];
  readonly exportDeclarations: readonly ModuleExportDeclaration[];
}
