import type { FileSystemAsyncPort } from '@arch-platform/contracts';

import { FilesystemArtifactOutputPreparer } from '../../src/artifact/adapter/filesystem-artifact-output-preparer.js';
import { PosixPathService } from '../../src/filesystem/paths/posix-path-service.js';

export function createPreparer(filesystem: FileSystemAsyncPort) {
  const pathService = new PosixPathService();

  return new FilesystemArtifactOutputPreparer(filesystem, pathService);
}
