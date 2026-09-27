// packages/infrastructure/src/compliance/compliance-state-provider.ts

import type {
  ComplianceEnvironment,
  ComplianceState,
  ComplianceStateReader,
  ComplianceStateWriter,
} from '@arch-platform/platform-model';

import { FilesystemComplianceStateReader } from '../artifact/adapter/filesystem-compliance-state-reader.js';
import { FilesystemComplianceStateWriter } from '../artifact/adapter/filesystem-compliance-state-writer.js';
import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';

export class ComplianceStateProvider {
  createReaderForWorkspace(workspaceRoot: string): ComplianceStateReader {
    return new FilesystemComplianceStateReader(
      new NodeAsyncFileSystemAdapter({ root: workspaceRoot }),
    );
  }

  createWriterForWorkspace(
    workspaceRoot: string,
    state: ComplianceState,
    environment: ComplianceEnvironment,
  ): ComplianceStateWriter {
    return new FilesystemComplianceStateWriter(
      state,
      new NodeAsyncFileSystemAdapter({ root: workspaceRoot }),
      environment,
    );
  }
}
