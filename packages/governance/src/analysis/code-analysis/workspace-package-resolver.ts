// packages/governance/src/analysis/code-analysis/workspace-package-resolver.ts

import type { PackageResolver } from '@arch/code-analysis';
import { DefaultPackageResolver } from '@arch/code-analysis';
import type { PackageDescriptor } from '@arch/platform-model';

export class WorkspacePackageResolver implements PackageResolver {
  private readonly fallback = new DefaultPackageResolver();

  constructor(private readonly packages: readonly PackageDescriptor[]) {}

  resolveFromFile(filePath: string): string | undefined {
    const normalizedFile = this.normalize(filePath);

    const pkg = this.packages.find((candidate) => {
      const root = this.normalize(candidate.rootPath);

      return normalizedFile === root || normalizedFile.startsWith(`${root}/`);
    });

    return pkg?.name;
  }

  resolveFromModuleSpecifier(moduleSpecifier: string): string | undefined {
    return this.fallback.resolveFromModuleSpecifier(moduleSpecifier);
  }

  private normalize(value: string): string {
    return value.replace(/\\/g, '/').replace(/\/+$/, '');
  }
}
