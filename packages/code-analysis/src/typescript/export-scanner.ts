import type { SourceFile } from 'ts-morph';

export function scanExports(
  source: SourceFile
) {

  return source
    .getExportDeclarations()
    .map(item =>
      item.getModuleSpecifierValue()
    )
    .filter(Boolean);
}
