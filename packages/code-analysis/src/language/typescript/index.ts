// packages/code-analysis/src/language/typescript/index.ts
export {
  ClassSymbolScanner,
  EnumSymbolScanner,
  FunctionSymbolScanner,
  InterfaceSymbolScanner,
  ReferenceAnalyzer,
  SymbolScanner,
  VariableSymbolScanner,
} from './scanners/index.js';
export type {
  ImportedSymbol,
  ReferenceScanner,
  SymbolDefinition,
  SymbolMetadataScanner,
} from './scanners/index.js';
export {
  ExportReferenceScanner,
  ImportReferenceScanner,
  ParameterTypeReferenceScanner,
  PropertyTypeReferenceScanner,
  ReturnTypeReferenceScanner,
} from './scanners/references/index.js';
export type { SourceReader, SourceScanner, SourceUnit } from './source/index.js';
export { TypeScriptSourceReader } from './typescript-source-reader.js';
export { TypeScriptSourceUnit } from './typescript-source-unit.js';
