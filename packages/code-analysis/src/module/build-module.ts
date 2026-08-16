// packages/code-analysis/src/module/build-module.ts

import type { ExportedDeclaration } from '../language/typescript/model/export-declaration.js';
import type { SourceUnit } from '../language/typescript/source/source-unit.js';
import type { PackageResolver } from '../package/resolvers/package-resolver.js';

import type { ModuleDescriptor } from './model/module-descriptor.js';
import type { ModuleExport } from './model/module-export.js';
import type { ModuleKind } from './model/module-kind.js';
import type { ModuleReference } from './model/module-reference.js';

export function buildModuleImports(
  source: SourceUnit,
  packageResolver: PackageResolver,
): readonly ModuleReference[] {
  return source.getImports().map((declaration) => ({
    sourceFile: source.path,
    moduleSpecifier: declaration.moduleSpecifier,
    isTypeOnly: declaration.isTypeOnly,
    kind: resolveKind(declaration.moduleSpecifier),
    packageName: packageResolver.resolveFromModuleSpecifier(declaration.moduleSpecifier),
    targetFile: declaration.resolvedFile,
    symbols: declaration.symbols.map((symbol) => ({
      name: symbol.name,
      symbolId: symbol.symbolId,
      isTypeOnly: symbol.isTypeOnlyImport,
    })),
  }));
}

export function buildModuleExports(
  source: SourceUnit,
  packageResolver: PackageResolver,
): readonly ModuleExport[] {
  return source
    .getExports()
    .flatMap((declaration) => buildModuleExport(source, declaration, packageResolver));
}

function buildModuleExport(
  source: SourceUnit,
  declaration: ExportedDeclaration,
  packageResolver: PackageResolver,
): readonly ModuleExport[] {
  const moduleSpecifier = declaration.moduleSpecifier ?? '';

  return declaration.symbols.map((symbol) => ({
    sourceFile: source.path,
    moduleSpecifier,
    isTypeOnly: symbol.isTypeOnlyExport,
    exportedName: symbol.exportedName,
    localName: symbol.localName,
    kind: resolveKind(moduleSpecifier),
    packageName: packageResolver.resolveFromModuleSpecifier(moduleSpecifier),
  }));
}

function resolveKind(moduleSpecifier?: string): ModuleKind {
  if (!moduleSpecifier) {
    return 'unknown';
  }

  if (moduleSpecifier.startsWith('.')) {
    return 'relative';
  }

  if (moduleSpecifier.startsWith('@')) {
    return 'package';
  }

  return 'external';
}
export function buildModuleDescriptor(
  source: SourceUnit,
  packageResolver: PackageResolver,
): ModuleDescriptor {
  return {
    filePath: source.path,
    imports: buildModuleImports(source, packageResolver),
    exports: buildModuleExports(source, packageResolver),
  };
}
