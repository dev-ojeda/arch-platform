// packages/code-analysis/src/language/index.ts

export { createReferenceAnalyzer } from './create-reference-analyzer.js';
export { createSymbolScanner } from './create-symbol-scanner.js';
export { createTypeScriptLanguage } from './create-typescript-language.js';
export { createTypeScriptProjectLoader } from './create-typescript-project-loader.js';

export { SymbolScanner, TypeScriptSourceReader, TypeScriptSourceUnit } from './typescript/index.js';
export type { SourceReader, SourceScanner, SourceUnit } from './typescript/index.js';
