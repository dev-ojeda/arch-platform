import type { FileSystemAsyncPort } from '@arch-platform/contracts';

import { FilesystemArtifactOutputPreparer } from '../../src/artifact/adapter/filesystem-artifact-output-preparer.js';

import { createTestPathService } from './create-path-service.js';

export function createPreparer(filesystem: FileSystemAsyncPort) {
  return new FilesystemArtifactOutputPreparer(filesystem, createTestPathService());
}
