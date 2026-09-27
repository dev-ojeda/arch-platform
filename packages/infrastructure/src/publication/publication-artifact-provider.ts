// packages/infrastructure/src/publication/publication-artifact-provider.ts

import type { PublicationArtifactReader } from '@arch-platform/platform-model';

import { ArtifactStateProvider } from '../artifact/artifact-state-provider.js';
import { ComplianceStateProvider } from '../compliance/compliance-state-provider.js';
import { SecurityStateProvider } from '../security/security-state-provider.js';

import { FilesystemPublicationArtifactReader } from './filesystem-publication-artifact-reader.js';

export class PublicationArtifactProvider {
  createReader(workspaceRoot: string): PublicationArtifactReader {
    return new FilesystemPublicationArtifactReader(
      new ArtifactStateProvider().createReaderForWorkspace(workspaceRoot),
      new ComplianceStateProvider().createReaderForWorkspace(workspaceRoot),
      new SecurityStateProvider().createReaderForWorkspace(workspaceRoot),
    );
  }
}
