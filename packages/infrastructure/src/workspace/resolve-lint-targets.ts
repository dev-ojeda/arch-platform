// packages/infrastructure/src/workspace/resolve-lint-targets.ts

import type { WorkspaceDescriptor } from '@arch/platform-model';

export function resolveLintTargets(
  workspace: WorkspaceDescriptor,
  packageName?: string,
): readonly string[] {
  const packages = packageName
    ? workspace.packages.filter((pkg) => pkg.name === packageName)
    : workspace.packages;

  return packages
    .flatMap((pkg) => {
      const targets: string[] = [];

      if (pkg.layout.hasSourceDirectory) {
        targets.push(pkg.layout.sourceDirectory);
      }

      if (pkg.layout.hasTestsDirectory) {
        targets.push(pkg.layout.testsDirectory);
      }

      return targets;
    })
    .sort();
}
