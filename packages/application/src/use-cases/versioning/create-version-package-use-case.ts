// packages/application/src/use-cases/versioning/create-version-package-use-case.ts

import { VersionCompositionRoot } from './version-composition-root.js';
import { VersionPackageUseCase } from './version-package.use-case.js';

export async function createVersionPackageUseCase(
  workspaceRoot: string,
  packageName: string,
): Promise<VersionPackageUseCase> {
  const { packageDescriptor, versionWriter, calculator } =
    await new VersionCompositionRoot().create(workspaceRoot, packageName);

  return new VersionPackageUseCase(packageDescriptor, calculator, versionWriter);
}
