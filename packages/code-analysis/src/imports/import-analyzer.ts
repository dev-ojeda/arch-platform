// packages/code-analysis/src/imports/import-analyzer.ts

import type { SourceFile } from 'ts-morph';

import type { ImportReference } from './import-types.js';

export function analyzeImports(sourceFile: SourceFile): readonly ImportReference[] {
  return sourceFile.getImportDeclarations().map((declaration) => {
    const moduleSpecifier = declaration.getModuleSpecifierValue();

    return {
      sourceFile: sourceFile.getFilePath(),

      moduleSpecifier,

      isRelative: moduleSpecifier.startsWith('.'),

      isPackage: !moduleSpecifier.startsWith('.'),

      packageName: resolvePackageName(moduleSpecifier),
    };
  });
}

function resolvePackageName(moduleSpecifier: string): string | undefined {
  if (moduleSpecifier.startsWith('.')) {
    return undefined;
  }

  if (moduleSpecifier.startsWith('@')) {
    const parts = moduleSpecifier.split('/');

    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : moduleSpecifier;
  }

  return moduleSpecifier.split('/')[0];
}
