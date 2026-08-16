// packages/code-analysis/src/language/typescript/source/source-unit.ts

import type { ClassDeclaration } from '../model/class-declaration.js';
import type { EnumDeclaration } from '../model/enum-declaration.js';
import type { ExportedDeclaration } from '../model/export-declaration.js';
import type { FunctionDeclaration } from '../model/function-declaration.js';
import type { ImportDeclaration } from '../model/import-declaration.js';
import type { InterfaceDeclaration } from '../model/interface-declaration.js';
import type { VariableDeclaration } from '../model/variable-declaration.js';

export interface SourceUnit {
  readonly path: string;

  getImports(): readonly ImportDeclaration[];

  getExports(): readonly ExportedDeclaration[];

  getClasses(): readonly ClassDeclaration[];

  getFunctions(): readonly FunctionDeclaration[];

  getInterfaces(): readonly InterfaceDeclaration[];

  getEnums(): readonly EnumDeclaration[];

  getSymbolIds(): readonly string[];

  getVariables(): readonly VariableDeclaration[];
}
