// packages/platform-model/src/workspace/workspace-provider.ts

import type { WorkspaceDescriptor } from './workspace-descriptor.js';

// platform-model
export interface WorkspaceProvider {
  discover(root: string): Promise<WorkspaceDescriptor>;
  findRoot(fromDirectory: string): string;
}
