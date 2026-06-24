// packages/code-analysis/src/imports/import-resolver.ts

import type { Project } from 'ts-morph';

import type { ImportReference, ResolvedImportReference } from './import-types.js';

export function resolveImports(
  project: Project,
  imports: readonly ImportReference[],
): readonly ResolvedImportReference[] {
  return imports.map((item) => {
    const sourceFile = project.getSourceFile(item.sourceFile);

    if (!sourceFile) {
      return {
        ...item,
        resolved: false,
      };
    }

    const declaration = sourceFile
      .getImportDeclarations()
      .find((importDecl) => importDecl.getModuleSpecifierValue() === item.moduleSpecifier);

    const target = declaration?.getModuleSpecifierSourceFile();

    return {
      ...item,

      targetFile: target?.getFilePath(),

      resolved: target !== undefined,
    };
  });
}
