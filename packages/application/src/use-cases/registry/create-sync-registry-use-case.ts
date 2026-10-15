// packages/application/src/use-cases/registry/create-sync-registry-use-case.ts

import { SyncRegistryCompositionRoot } from './sync-registry-composition-root.js';
import { SyncRegistryUseCase } from './sync-registry.use-case.js';

export async function createSyncRegistryUseCase(
  workspaceRoot: string,
): Promise<SyncRegistryUseCase> {
  const { npmRegistryPublishedVersionsAdapter, registryReader, registryWriter } =
    await new SyncRegistryCompositionRoot().create(workspaceRoot);

  return new SyncRegistryUseCase(
    npmRegistryPublishedVersionsAdapter,
    registryReader,
    registryWriter,
  );
}
