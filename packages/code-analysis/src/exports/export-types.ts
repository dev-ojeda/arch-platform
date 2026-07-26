// packages/code-analysis/src/exports/export-types.ts

export interface ExportReference {
  readonly sourceFile: string;

  readonly moduleSpecifier: string;

  readonly isRelative: boolean;

  readonly isPackage: boolean;

  readonly packageName?: string;
}
