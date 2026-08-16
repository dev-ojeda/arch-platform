// packages/governance/src/analysis/imports/import-target-resolver.ts

import type { SymbolEdge, SymbolNode } from '@arch/code-analysis';
import type { PackageDescriptor } from '@arch/platform-model';

import { GovernancePackageQuery } from '../../context/governance-package-query.js';

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
  packages: GovernancePackageQuery,
): PackageDescriptor | undefined {
  // 1. Import directo del package
  const exact = packages.get(moduleSpecifier);

  if (exact) {
    return exact;
  }

  // 2. Import de un subpath del package
  return packages.all().find((pkg) => moduleSpecifier.startsWith(`${pkg.name}/`));
}
