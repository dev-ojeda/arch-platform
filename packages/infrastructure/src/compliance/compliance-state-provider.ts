// packages/infrastructure/src/compliance/compliance-state-provider.ts

import type {
  ComplianceEnvironment,
  ComplianceState,
  ComplianceStateReader,
  ComplianceStateWriter,
} from '@arch/platform-model';

import { FilesystemComplianceStateReader } from '../artifact/adapter/filesystem-compliance-state-reader.js';
import { FilesystemComplianceStateWriter } from '../artifact/adapter/filesystem-compliance-state-writer.js';
import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';
import { NodePathService } from '../filesystem/paths/node-path-service.js';

export class ComplianceStateProvider {
  createReader(): ComplianceStateReader {
    return new FilesystemComplianceStateReader(
      new NodeAsyncFileSystemAdapter(),
      new NodePathService(),
    );
  }

  createWriter(
    workspaceRoot: string,
    state: ComplianceState,
    environment: ComplianceEnvironment,
  ): ComplianceStateWriter {
    return new FilesystemComplianceStateWriter(
      state,
      new NodeAsyncFileSystemAdapter(),
      new NodePathService(),
      workspaceRoot,
      environment,
    );
  }
}
