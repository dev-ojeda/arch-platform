// packages/infrastructure/src/workspace/workspace-package-projector.ts

import type {
  PackageDescriptor,
  PackageManifest,
  WorkspacePackage,
  WorkspaceProjector,
} from '@arch/platform-model';

export class WorkspacePackageProjector implements WorkspaceProjector {
  project(packageDescriptor: PackageDescriptor): WorkspacePackage {
    const { manifest } = packageDescriptor;

    return {
      name: packageDescriptor.name,
      root: packageDescriptor.rootPath,
      dependencies: Object.keys(manifest.dependencies ?? {}).sort(),
      buildDependencies: Object.keys(manifest.devDependencies ?? {})
        .filter((dependency) => dependency.startsWith('@arch/'))
        .sort(),
      outputs: this.resolveOutputs(manifest),
      build: manifest.arch?.build,
    };
  }

  projectAll(packages: readonly PackageDescriptor[]): readonly WorkspacePackage[] {
    return packages.map((pkg) => this.project(pkg));
  }

  private resolveOutputs(manifest: PackageManifest): readonly string[] {
    if (manifest.arch?.build?.outputs?.length) {
      return [...manifest.arch.build.outputs];
    }

    const outputs = new Set<string>();

    if (manifest.main) {
      outputs.add(this.normalizeOutput(manifest.main));
    }

    if (manifest.types) {
      outputs.add(this.normalizeOutput(manifest.types));
    }

    return [...outputs];
  }

  private normalizeOutput(value: string): string {
    return value.replace(/^\.?\//, '');
  }
}
