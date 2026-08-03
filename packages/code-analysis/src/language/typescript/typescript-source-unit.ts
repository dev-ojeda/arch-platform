// packages/code-analysis/src/language/typescript/typescript-source-unit.ts

import type {
  PropertySignature,
  SourceFile,
  MethodDeclaration as TsMethodDeclaration,
  PropertyDeclaration as TsPropertyDeclaration,
  Type,
} from 'ts-morph';

import type { ClassDeclaration } from './model/class-declaration.js';
import type { ExportedDeclaration } from './model/export-declaration.js';
import type { FunctionDeclaration } from './model/function-declaration.js';
import type { ImportDeclaration } from './model/import-declaration.js';
import type { InterfaceDeclaration } from './model/interface-declaration.js';
import type { MethodDeclaration } from './model/method-declaration.js';
import type { ParameterDeclaration } from './model/parameter-declaration.js';
import type { PropertyDeclaration } from './model/property-declaration.js';
import type { TypeDeclaration } from './model/type-declaration.js';
import type { ImportedSymbol } from './scanners/symbols/index.js';
import type { SourceUnit } from './source/source-unit.js';
import { createSymbolId, resolveSymbolId } from './typescript-source-symbol.js';

export class TypeScriptSourceUnit implements SourceUnit {
  constructor(private readonly sourceFile: SourceFile) {}

  get path(): string {
    return this.sourceFile.getFilePath();
  }

  getImports(): readonly ImportDeclaration[] {
    return this.sourceFile.getImportDeclarations().map((declaration) => ({
      moduleSpecifier: declaration.getModuleSpecifierValue(),

      resolvedFile: declaration.getModuleSpecifierSourceFile()?.getFilePath(),

      symbols: declaration.getNamedImports().map(
        (item): ImportedSymbol => ({
          name: item.getName(),
          symbolId: resolveSymbolId(item.getNameNode().getSymbol()),
        }),
      ),
    }));
  }

  getExports(): readonly ExportedDeclaration[] {
    return this.sourceFile.getExportDeclarations().map((declaration) => ({
      moduleSpecifier: declaration.getModuleSpecifierValue() ?? undefined,

      symbols: declaration.getNamedExports().map((item) => {
        const name = item.getAliasNode()?.getText() ?? item.getName();

        return {
          id: createSymbolId(this.path, name),

          exportedName: item.getName(),

          localName: name,
        };
      }),
    }));
  }

  getClasses(): readonly ClassDeclaration[] {
    return this.sourceFile.getClasses().map((declaration) => ({
      symbolId: createSymbolId(this.path, declaration.getName() ?? '<anonymous>'),

      name: declaration.getName() ?? '<anonymous>',

      methods: declaration.getMethods().map((method) => this.createMethod(method)),

      properties: declaration.getProperties().map((property) => this.createProperty(property)),
    }));
  }

  getFunctions(): readonly FunctionDeclaration[] {
    return this.sourceFile.getFunctions().map((declaration) => ({
      symbolId: createSymbolId(this.path, declaration.getName() ?? '<anonymous>'),

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
      symbolId: createSymbolId(this.sourceFile.getFilePath(), declaration.getName()),

      name: declaration.getName(),

      properties: declaration.getProperties().map((property) => this.createProperty(property)),
    }));
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
}
