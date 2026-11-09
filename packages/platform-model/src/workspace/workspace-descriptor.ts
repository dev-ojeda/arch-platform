// packages/platform-model/src/workspace/workspace-descriptor.ts

import type { WorkspaceLayout } from './workspace-layout.js';
import type { PackageDescriptor } from '../package/package-descriptor.js';


export interface WorkspaceDescriptor {
  readonly root: string;

  readonly layout: WorkspaceLayout;

  readonly packages: readonly PackageDescriptor[];
}
