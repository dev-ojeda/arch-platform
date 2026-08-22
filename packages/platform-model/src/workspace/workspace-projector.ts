// packages/platform-model/src/workspace/workspace-projector.ts

import type { PackageDescriptor } from '../package/package-descriptor.js';

import type { WorkspacePackage } from './workspace-package.js';

export interface WorkspaceProjector {
  project(packageDescriptor: PackageDescriptor): WorkspacePackage;
  projectAll(packages: readonly PackageDescriptor[]): readonly WorkspacePackage[];
}
