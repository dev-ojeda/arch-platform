// packages/code-analysis/src/language/typescript/typescript-source-unit.ts

import type {
  PropertySignature,
  SourceFile,
  ExportDeclaration as TsExportDeclaration,
  MethodDeclaration as TsMethodDeclaration,
  PropertyDeclaration as TsPropertyDeclaration,
  Type,
} from 'ts-morph';

import type { ExportKind } from '../../api-surface/model/export-kind.js';
import type { ExportedSymbol } from '../../public/exported-symbol.js';

import type { ClassDeclaration } from './model/class-declaration.js';
import type { EnumDeclaration } from './model/enum-declaration.js';
import type { ExportedDeclaration } from './model/export-declaration.js';
import type { FunctionDeclaration } from './model/function-declaration.js';
import type { ImportDeclaration } from './model/import-declaration.js';
import type { InterfaceDeclaration } from './model/interface-declaration.js';
import type { MethodDeclaration } from './model/method-declaration.js';
import type { ParameterDeclaration } from './model/parameter-declaration.js';
import type { PropertyDeclaration } from './model/property-declaration.js';
import type { TypeDeclaration } from './model/type-declaration.js';
import type { VariableDeclaration } from './model/variable-declaration.js';
import type { ImportedSymbol } from './scanners/symbols/imported-symbol.js';
import type { SourceUnit } from './source/source-unit.js';
import { createSymbolId, resolveSymbolId, resolveSymbolKind } from './typescript-source-symbol.js';

export class TypeScriptSourceUnit implements SourceUnit {
  constructor(private readonly sourceFile: SourceFile) {}

  get path(): string {
    return this.sourceFile.getFilePath();
  }

  getImports(): readonly ImportDeclaration[] {
    return this.sourceFile.getImportDeclarations().map((declaration) => {
      const moduleSpecifier = declaration.getModuleSpecifierValue();
      const resolvedFile = declaration.getModuleSpecifierSourceFile()?.getFilePath();
      const isTypeOnly = declaration.isTypeOnly();
      return {
        moduleSpecifier,
        resolvedFile,
        isTypeOnly,
        symbols: declaration.getNamedImports().map((item): ImportedSymbol => {
          return {
            name: item.getName(),
            symbolId: resolveSymbolId(item.getNameNode().getSymbol()),
            kind: resolveSymbolKind(item.getNameNode().getSymbol()),
            isTypeOnlyImport: declaration.isTypeOnly() || item.isTypeOnly(),
          };
        }),
      };
    });
  }

  getExports(): readonly ExportedDeclaration[] {
    const exportedDeclarations: ExportedDeclaration[] = [];

    for (const exportDeclaration of this.sourceFile.getExportDeclarations()) {
      const moduleSpecifier = exportDeclaration.getModuleSpecifierValue() ?? undefined;
      const resolvedFile = exportDeclaration.getModuleSpecifierSourceFile()?.getFilePath();
      const kind = this.resolveExportKind(exportDeclaration);

      const isTypeOnlyDeclaration = exportDeclaration.isTypeOnly();

      const symbols =
        kind === 'star'
          ? this.resolveStarExportSymbols(exportDeclaration)
          : this.resolveNamedExportSymbols(exportDeclaration);

      exportedDeclarations.push({
        kind,
        moduleSpecifier,
        resolvedFile,
        isTypeOnlyDeclaration,
        symbols,
      });
    }

    return exportedDeclarations;
  }
  getClasses(): readonly ClassDeclaration[] {
    return this.sourceFile.getClasses().map((declaration) => ({
      symbolId: createSymbolId(
        declaration.getSourceFile().getFilePath(),
        declaration.getName() ?? '<anonymous>',
      ),

      name: declaration.getName() ?? '<anonymous>',

      methods: declaration.getMethods().map((method) => this.createMethod(method)),

      properties: declaration.getProperties().map((property) => this.createProperty(property)),
    }));
  }

  getFunctions(): readonly FunctionDeclaration[] {
    return this.sourceFile.getFunctions().map((declaration) => ({
      symbolId: createSymbolId(
        declaration.getSourceFile().getFilePath(),
        declaration.getName() ?? '<anonymous>',
      ),

      name: declaration.getName() ?? '<anonymous>',

      parameters: declaration.getParameters().map((parameter) => ({
        name: parameter.getName(),
        type: this.createTypeReference(parameter.getType()),
      })),

      returnType: this.createTypeReference(declaration.getReturnType()),
    }));
  }

  getInterfaces(): readonly InterfaceDeclaration[] {
    return this.sourceFile.getInterfaces().map((declaration) => ({
      symbolId: createSymbolId(declaration.getSourceFile().getFilePath(), declaration.getName()),

      name: declaration.getName(),

      properties: declaration.getProperties().map((property) => this.createProperty(property)),
    }));
  }

  getEnums(): readonly EnumDeclaration[] {
    return this.sourceFile.getEnums().map((declaration) => ({
      symbolId: createSymbolId(declaration.getSourceFile().getFilePath(), declaration.getName()),
      name: declaration.getName(),
    }));
  }

  getSymbolIds(): readonly string[] {
    return [
      ...this.getClasses().map((x) => x.symbolId),
      ...this.getInterfaces().map((x) => x.symbolId),
      ...this.getFunctions().map((x) => x.symbolId),
      ...this.getEnums().map((x) => x.symbolId),
      ...this.getVariables().map((x) => x.symbolId),
    ];
  }

  getVariables(): readonly VariableDeclaration[] {
    return this.sourceFile.getVariableDeclarations().map((declaration) => ({
      symbolId: createSymbolId(declaration.getSourceFile().getFilePath(), declaration.getName()),

      name: declaration.getName(),
    }));
  }
  private resolveNamedExportSymbols(exportDeclaration: TsExportDeclaration): ExportedSymbol[] {
    const symbols: ExportedSymbol[] = [];

    const resolvedDeclarations = this.sourceFile.getExportedDeclarations();

    for (const namedExport of exportDeclaration.getNamedExports()) {
      const name = namedExport.getName();

      const declarations = resolvedDeclarations.get(name) ?? [];

      for (const declaration of declarations) {
        const symbol = declaration.getSymbol();
        const resolvedSymbol = symbol?.getAliasedSymbol() ?? symbol;

        symbols.push({
          id: resolveSymbolId(resolvedSymbol) ?? createSymbolId(this.path, name),

          exportedName: name,

          localName: namedExport.getAliasNode()?.getText() ?? name,

          exportKind: this.resolveExportKind(exportDeclaration),

          symbolKind: resolveSymbolKind(resolvedSymbol),

          moduleSpecifier: exportDeclaration.getModuleSpecifierValue() ?? undefined,

          isTypeOnlyExport: exportDeclaration.isTypeOnly() || namedExport.isTypeOnly(),
        });
      }
    }

    return symbols;
  }
  private resolveStarExportSymbols(exportDeclaration: TsExportDeclaration): ExportedSymbol[] {
    const symbols: ExportedSymbol[] = [];

    for (const [name, declarations] of this.sourceFile.getExportedDeclarations()) {
      for (const declaration of declarations) {
        const symbol = declaration.getSymbol();
        const resolvedSymbol = symbol?.getAliasedSymbol() ?? symbol;

        symbols.push({
          id: resolveSymbolId(resolvedSymbol) ?? createSymbolId(this.path, name),

          exportedName: name,

          localName: name,

          exportKind: 'star',

          symbolKind: resolveSymbolKind(resolvedSymbol),

          moduleSpecifier: exportDeclaration.getModuleSpecifierValue() ?? undefined,

          isTypeOnlyExport: exportDeclaration.isTypeOnly(),
        });
      }
    }

    return symbols;
  }
  private createMethod(method: TsMethodDeclaration): MethodDeclaration {
    return {
      name: method.getName(),

      parameters: method.getParameters().map(
        (parameter): ParameterDeclaration => ({
          name: parameter.getName(),
          type: this.createTypeReference(parameter.getType()),
        }),
      ),

      returnType: this.createTypeReference(method.getReturnType()),
    };
  }

  private createProperty(property: TsPropertyDeclaration | PropertySignature): PropertyDeclaration {
    return {
      name: property.getName(),

      type: this.createTypeReference(property.getType()),
    };
  }

  private createTypeReference(type: Type): TypeDeclaration {
    return {
      displayName: type.getText(),
      symbolId: resolveSymbolId(type.getSymbol()),
    };
  }

  private resolveExportKind(declaration: TsExportDeclaration): ExportKind {
    if (this.isStarExport(declaration)) {
      return 'star';
    }

    if (declaration.isNamespaceExport()) {
      return 'namespace';
    }

    const namedExports = declaration.getNamedExports();
    if (
      namedExports.length === 1 &&
      namedExports[0]?.getName() === 'default' &&
      !namedExports[0]?.getAliasNode()
    ) {
      return 'default';
    }

    return 'named';
  }

  private isStarExport(declaration: TsExportDeclaration): boolean {
    return declaration.compilerNode.exportClause === undefined;
  }
}
