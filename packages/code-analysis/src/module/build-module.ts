// packages/code-analysis/src/module/build-module.ts

// packages/code-analysis/src/module/build-module.ts



import type { ModuleDeclaration } from './model/module-declaration.js';
import type { ModuleKind } from './model/module-kind.js';
import type { ModuleReference } from './model/module-reference.js';
import type { PackageResolver } from '../package/resolvers/package-resolver.js';
import type { SourceFile } from 'ts-morph';

export function buildModuleImports(
  sourceFile: SourceFile,
  packageResolver: PackageResolver,
): readonly ModuleReference[] {
  return buildReferences(sourceFile, sourceFile.getImportDeclarations(), packageResolver);
}

export function buildModuleExports(
  sourceFile: SourceFile,
  packageResolver: PackageResolver,
): readonly ModuleReference[] {
  return buildReferences(sourceFile, sourceFile.getExportDeclarations(), packageResolver);
}

function buildReferences(
  sourceFile: SourceFile,
  declarations: readonly ModuleDeclaration[],
  packageResolver: PackageResolver,
): readonly ModuleReference[] {
  const filePath = sourceFile.getFilePath();

  return declarations.flatMap((declaration) => {
    const moduleSpecifier = declaration.getModuleSpecifierValue();

    if (!moduleSpecifier) {
      return [];
    }

    return [
      {
        sourceFile: filePath,
        moduleSpecifier,
        kind: resolveKind(moduleSpecifier),
        packageName: packageResolver.resolveFromModuleSpecifier(moduleSpecifier),
      },
    ];
  });
}

function resolveKind(moduleSpecifier: string): ModuleKind {
  if (moduleSpecifier.startsWith('.')) {
    return 'relative';
  }

  if (moduleSpecifier.startsWith('@')) {
    return 'package';
  }

  return 'external';
}
