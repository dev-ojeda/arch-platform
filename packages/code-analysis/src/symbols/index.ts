// packages/code-analysis/src/symbols/index.ts

export type {
  ClassMetadata,
  ClassMethodMetadata,
  ClassPropertyMetadata,
} from './class-metadata.js';
export { scanFunctions } from './function-scanner.js';
export type { InterfaceMetadata, InterfacePropertyMetadata } from './interface-metadata.js';
export * from './references/symbol-reference-scanner.js';
export { scanClasses } from './scan-classes.js';
export { scanInterfaces } from './scan-interfaces.js';
export { scanSymbols } from './scan-symbols.js';
export { analyzeExports } from './symbol-analyzer.js';
export type { SymbolDefinition, SymbolKind } from './symbol-types.js';
