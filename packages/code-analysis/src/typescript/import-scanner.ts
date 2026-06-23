import type { SourceFile } from 'ts-morph';

export function scanImports(
  source: SourceFile
) {

  return source
    .getImportDeclarations()
    .map(item =>
      item.getModuleSpecifierValue()
    );
}
