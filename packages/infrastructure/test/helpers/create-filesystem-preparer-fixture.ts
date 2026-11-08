import type { FileSystemAsyncPort } from '@arch-platform/contracts';

import { createTestPathService } from './create-path-service.js';
import { FilesystemArtifactOutputPreparer } from '../../src/artifact/adapter/filesystem-artifact-output-preparer.js';


export function createPreparer(filesystem: FileSystemAsyncPort) {
  return new FilesystemArtifactOutputPreparer(filesystem, createTestPathService());
}
