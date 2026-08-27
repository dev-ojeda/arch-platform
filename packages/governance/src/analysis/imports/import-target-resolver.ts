// packages/governance/src/analysis/imports/import-target-resolver.ts

import type { SymbolEdge, SymbolNode } from '@arch/code-analysis';
import type { PackageDescriptor } from '@arch/platform-model';

import type { PackageQuery } from '../../context/package-query.js';

export function resolveExternalImportTarget(
  edge: SymbolEdge,
  packageName: string,
): SymbolNode | undefined {
  const kind = edge.metadata?.kind;

  if (
    kind !== 'class' &&
    kind !== 'enum' &&
    kind !== 'function' &&
    kind !== 'variable' &&
    kind !== 'interface' &&
    kind !== 'type'
  ) {
    return undefined;
  }

  const separatorIndex = edge.to.lastIndexOf('#');

  if (separatorIndex < 0) {
    return undefined;
  }

  return {
    id: edge.to,
    name: edge.to.slice(separatorIndex + 1),
    kind,
    sourceFile: edge.to.slice(0, separatorIndex),
    package: packageName,
  };
}

export function resolveTargetPackage(
  moduleSpecifier: string,
  packages: PackageQuery,
): PackageDescriptor | undefined {
  const exact = packages.get(moduleSpecifier);

  if (exact) {
    return exact;
  }

  return packages.all().find((pkg) => moduleSpecifier.startsWith(`${pkg.name}/`));
}

export function resolveTargetPackageFromFile(
  filePath: string,
  packages: PackageQuery,
): PackageDescriptor | undefined {
  const normalizedFile = filePath.replace(/\\/g, '/');

  return packages.all().find((pkg) => {
    const rootPath = pkg.rootPath.replace(/\\/g, '/').replace(/\/$/, '');

    return normalizedFile === rootPath || normalizedFile.startsWith(`${rootPath}/`);
  });
}
