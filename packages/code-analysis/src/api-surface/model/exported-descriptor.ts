// packages/code-analysis/src/api-surface/model/exported-descriptor.ts

import type { ExportKind } from './export-kind.js';

export interface ExportDescriptor {
  kind: ExportKind;
  moduleSpecifier?: string;
}
