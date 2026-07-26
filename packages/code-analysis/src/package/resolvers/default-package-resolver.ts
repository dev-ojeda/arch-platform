// packages/code-analysis/src/package/resolvers/default-package-resolver.ts

import type { PackageResolver } from './package-resolver.js';

export class DefaultPackageResolver implements PackageResolver {
  resolveFromFile(filePath: string): string | undefined {
    const normalized = filePath.replace(/\\/g, '/');

    const match = normalized.match(/\/?packages\/([^/]+)/);

    return match ? `@arch/${match[1]}` : undefined;
  }

  resolveFromModuleSpecifier(moduleSpecifier: string): string | undefined {
    if (moduleSpecifier.startsWith('.')) {
      return undefined;
    }

    if (moduleSpecifier.startsWith('@')) {
      const parts = moduleSpecifier.split('/');

      return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : moduleSpecifier;
    }

    return moduleSpecifier.split('/')[0];
  }
}
