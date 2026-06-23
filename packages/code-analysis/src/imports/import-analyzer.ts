// packages/code-analysis/src/imports/import-analyzer.ts

import type { SourceFile } from 'ts-morph';

import type { ImportReference } from './import-types.js';

export function analyzeImports(file: SourceFile): ImportReference[] {
  return file.getImportDeclarations().map((importDecl) => ({
    source: importDecl.getModuleSpecifierValue(),

    filePath: file.getFilePath(),

    isTypeOnly: importDecl.isTypeOnly(),

    symbols: importDecl.getNamedImports().map((x) => x.getName()),
  }));
}
