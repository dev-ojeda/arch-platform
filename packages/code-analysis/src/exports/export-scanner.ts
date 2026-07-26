// packages/code-analysis/src/exports/export-scanner.ts
import type { ExportDeclaration, SourceFile } from 'ts-morph';

export function exportScanner(source: SourceFile): readonly ExportDeclaration[] {
  return source.getExportDeclarations();
}
