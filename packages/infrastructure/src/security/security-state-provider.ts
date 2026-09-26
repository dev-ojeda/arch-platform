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
import { NodePathService } from '../filesystem/paths/node-path-service.js';

export class SecurityStateProvider implements SecurityStateProviderPort {
  createReader(): SecurityStateReader {
    return new FilesystemSecurityStateReader(new NodeAsyncFileSystemAdapter());
  }

  createReaderForWorkspace(workspaceRoot: string): SecurityStateReader {
    return new FilesystemSecurityStateReader(
      new NodeAsyncFileSystemAdapter({ root: workspaceRoot }),
    );
  }

  createComplianceArtifactReader(): SecurityComplianceArtifactReader {
    return new FilesystemSecurityComplianceArtifactReader(
      new NodeAsyncFileSystemAdapter(),
      new NodePathService(),
    );
  }

  createWriter(workspaceRoot: string, state: SecurityState): SecurityStateWriter {
    return new FilesystemSecurityStateWriter(
      state,
      new NodeAsyncFileSystemAdapter(),
      new NodePathService(),
      workspaceRoot,
    );
  }
}
