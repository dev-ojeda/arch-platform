// packages/compliance/src/dependency/dependency-lock-file-query.ts

import type {
  DependencyLockfile,
  DependencyLockfileImporter,
  DependencyLockfilePackage,
  DependencyLockfilePackageSpec,
  DependencyLockfileSnapshot,
} from '@arch-platform/platform-model';

export class DependencyLockfileQuery {
  constructor(private readonly lockfile: DependencyLockfile) {}

  getImporter(name: string): DependencyLockfileImporter | undefined {
    return this.lockfile.importers[name];
  }

  getPackage(name: string, version: string): DependencyLockfilePackage | undefined {
    const key = this.resolvePackageKey(name, version);
    if (!key) {
      return undefined;
    }
    return this.lockfile.packages[key];
  }

  getPackages(name: string): ReadonlyMap<string, DependencyLockfilePackage> {
    const packages = new Map<string, DependencyLockfilePackage>();
    const prefix = `${name}@`;

    for (const [key, pkg] of Object.entries(this.lockfile.packages)) {
      if (!key.startsWith(prefix)) {
        continue;
      }

      const version = key.slice(prefix.length);
      packages.set(version, pkg);
    }

    return packages;
  }

  getCatalogDependency(
    catalogName: string,
    packageName: string,
  ): DependencyLockfilePackageSpec | undefined {
    return this.lockfile.catalogs[catalogName]?.[packageName];
  }
  getSnapshot(name: string, version: string): DependencyLockfileSnapshot | undefined {
    const key = `${name}@${version}`;

    return this.lockfile.snapshots[key];
  }
  private resolvePackageKey(name: string, version: string): string | undefined {
    const key = `${name}@${version}`;

    return key in this.lockfile.packages ? key : undefined;
  }
}
