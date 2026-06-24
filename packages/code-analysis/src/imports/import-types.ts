// packages/code-analysis/src/imports/import-types.ts

export interface ImportReference {
  readonly sourceFile: string;

  readonly moduleSpecifier: string;

  readonly isRelative: boolean;

  readonly isPackage: boolean;

  readonly packageName?: string;
}

export type ImportResolutionType = 'relative' | 'package' | 'external' | 'unknown';

export interface ResolvedImport {
  readonly sourceFile: string;

  readonly moduleSpecifier: string;

  readonly resolutionType: ImportResolutionType;

  readonly targetFile?: string;

  readonly targetPackage?: string;
}

export interface ResolvedImportReference extends ImportReference {
  readonly targetFile?: string;

  readonly resolved: boolean;
}

export interface ImportDependency {
  readonly sourceFile: string;
  readonly moduleSpecifier: string;
}

export interface FileImports {
  readonly sourceFile: string;
  readonly imports: readonly ImportDependency[];
}

export interface PackageImport {
  readonly sourcePackage: string;
  readonly targetPackage: string;
}
