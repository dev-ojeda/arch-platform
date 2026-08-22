// packages/platform-model/src/workspace/workspace-provider.ts

import type { WorkspaceDescriptor } from './workspace-descriptor.js';

export interface WorkspaceProvider {
  discover(fromDirectory: string): Promise<WorkspaceDescriptor>;
}
