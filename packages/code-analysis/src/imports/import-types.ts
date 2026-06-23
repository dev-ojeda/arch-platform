// packages/code-analysis/src/imports/import-types.ts

export interface ImportReference {
  source: string;

  filePath: string;

  isTypeOnly: boolean;

  symbols: string[];
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
