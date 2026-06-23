// packages/code-analysis/src/symbols/symbol-analyzer.ts

import type { SourceFile } from 'ts-morph';

export function analyzeExports(file: SourceFile) {
  return file.getExportedDeclarations().keys();
}
