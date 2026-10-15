// packages/platform-model/src/registry/registry-published-versions-provider-port.ts

import type { RegistryPublishedVersionsReader } from './registry-published-versions-reader.js';
import type { RegistryPublishedVersionsWriter } from './registry-published-versions-writer.js';

export interface RegistryPublishedVersionsProviderPort {
  createReaderForWorkspace(workspaceRoot: string): RegistryPublishedVersionsReader;

  createWriterForWorkspace(workspaceRoot: string): Promise<RegistryPublishedVersionsWriter>;
}
