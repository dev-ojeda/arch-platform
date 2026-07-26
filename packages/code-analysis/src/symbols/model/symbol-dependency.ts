// packages/code-analysis/src/symbols/model/symbol-dependency.ts

export interface SymbolDependency {
  /**
   * Symbol that consumes or references another symbol
   */
  sourceSymbolId: string;

  /**
   * Symbol being consumed
   */
  targetSymbolId: string;

  /**
   * Package where source symbol lives
   */
  sourcePackage: string;

  /**
   * Package where target symbol lives
   */
  targetPackage: string;

  /**
   * Source file path
   */
  sourceFile: string;

  /**
   * Target file path
   */
  targetFile: string;

  /**
   * Dependency kind
   */
  type: 'import' | 'reference' | 'extends' | 'implements' | 'call';
}
