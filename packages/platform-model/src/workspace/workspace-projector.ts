// packages/platform-model/src/workspace/workspace-projector.ts

import type { WorkspacePackage } from './workspace-package.js';
import type { PackageDescriptor } from '../package/package-descriptor.js';


export interface WorkspaceProjector {
  project(packageDescriptor: PackageDescriptor): WorkspacePackage;
  projectAll(packages: readonly PackageDescriptor[]): readonly WorkspacePackage[];
}
