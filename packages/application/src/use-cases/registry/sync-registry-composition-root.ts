// packages/application/src/use-cases/registry/sync-registry-composition-root.ts

import {
  NodeWorkspaceProvider,
  NpmRegistryPublishedVersionsAdapter,
  RegistryPublishedVersionsProvider,
} from '@arch-platform/infrastructure';

export class SyncRegistryCompositionRoot {
  async create(fromDirectory: string) {
    const workspaceProvider = new NodeWorkspaceProvider();
    const workspace = await workspaceProvider.discover(fromDirectory);

    const npmRegistryPublishedVersionsAdapter = new NpmRegistryPublishedVersionsAdapter();

    const registryPublishedVersionsProvider = new RegistryPublishedVersionsProvider();

    const registryReader = registryPublishedVersionsProvider.createReaderForWorkspace(
      workspace.root,
    );

    const registryWriter = await registryPublishedVersionsProvider.createWriterForWorkspace(
      workspace.root,
    );

    return {
      npmRegistryPublishedVersionsAdapter,
      registryReader,
      registryWriter,
    };
  }
}
