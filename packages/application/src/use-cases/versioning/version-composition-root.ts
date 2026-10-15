// packages/application/src/use-cases/versioning/version-composition-root.ts

import {
  NodeWorkspaceProvider,
  PackageVersionProvider,
  RegistryPublishedVersionsProvider,
  SemanticVersionCalculator,
} from '@arch-platform/infrastructure';

export class VersionCompositionRoot {
  async create(fromDirectory: string, packageName?: string) {
    const workspaceProvider = new NodeWorkspaceProvider();
    const workspace = await workspaceProvider.discover(fromDirectory);

    const packageDescriptor = workspace.packages.find((pkg) => pkg.name === packageName);

    if (!packageDescriptor) {
      throw new Error(`Package "${packageName}" was not found`);
    }

    if (!packageDescriptor.manifestPath) {
      throw new Error(`Manifest for "${packageName}" is unavailable`);
    }

    const versionProvider = new PackageVersionProvider();
    const versionWriter = versionProvider.createWriterForWorkspace(workspace.root);
    const calculator = new SemanticVersionCalculator();

    const registryProvider = new RegistryPublishedVersionsProvider();
    const registryReader = registryProvider.createReaderForWorkspace(workspace.root);

    return {
      packageDescriptor,
      versionWriter,
      calculator,
      registryReader,
    };
  }
}
