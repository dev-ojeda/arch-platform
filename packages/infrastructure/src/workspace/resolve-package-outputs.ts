// packages/infrastructure/src/workspace/resolve-package-outputs.ts

import type { PackageJson } from '@arch/platform-model';

export function resolvePackageOutputs(pkg: PackageJson): string[] {
  if (pkg.outputs?.length) {
    return [...pkg.outputs];
  }

  const outputs = new Set<string>();

  if (pkg.main) {
    outputs.add(normalizeOutput(pkg.main));
  }

  if (pkg.types) {
    outputs.add(normalizeOutput(pkg.types));
  }

  return [...outputs];
}

function normalizeOutput(value: string): string {
  return value.replace(/^\.?\//, '');
}
