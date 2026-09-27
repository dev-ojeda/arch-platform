// packages/infrastructure/src/security/security-state-provider.ts

import type {
  SecurityComplianceArtifactReader,
  SecurityState,
  SecurityStateProviderPort,
  SecurityStateReader,
  SecurityStateWriter,
} from '@arch-platform/platform-model';

import { FilesystemSecurityComplianceArtifactReader } from '../artifact/adapter/filesystem-security-compliance-artifact-reader.js';
import { FilesystemSecurityStateReader } from '../artifact/adapter/filesystem-security-state-reader.js';
import { FilesystemSecurityStateWriter } from '../artifact/index.js';
import { NodeAsyncFileSystemAdapter } from '../filesystem/adapters/node-async-filesystem-adapter.js';

export class SecurityStateProvider implements SecurityStateProviderPort {
  createReaderForWorkspace(workspaceRoot: string): SecurityStateReader {
    return new FilesystemSecurityStateReader(
      new NodeAsyncFileSystemAdapter({ root: workspaceRoot }),
    );
  }

  createComplianceArtifactReaderForWorkspace(
    workspaceRoot: string,
  ): SecurityComplianceArtifactReader {
    const filesystem = new NodeAsyncFileSystemAdapter({
      root: workspaceRoot,
    });

    return new FilesystemSecurityComplianceArtifactReader(filesystem);
  }

  createWriterForWorkspace(workspaceRoot: string, state: SecurityState): SecurityStateWriter {
    return new FilesystemSecurityStateWriter(
      state,
      new NodeAsyncFileSystemAdapter({ root: workspaceRoot }),
    );
  }
}
