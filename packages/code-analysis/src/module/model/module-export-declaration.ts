import type { ExportKind } from '../../api-surface/model/export-kind.js';

export interface ModuleExportDeclaration {
  readonly sourceFile: string;
  readonly kind: ExportKind;
  readonly moduleSpecifier?: string;
  readonly resolvedFile?: string;
  readonly isTypeOnly: boolean;
}
