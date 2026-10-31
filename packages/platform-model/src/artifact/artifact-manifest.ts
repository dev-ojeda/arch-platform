// packages/platform-model/src/artifact/artifact-manifest.ts

import type { Artifact } from './artifact.js';

export interface OutputFingerprint {
  /** Ruta relativa del output declarado. */
  readonly path: string;

  /** Tamaño total del output, expresado en bytes. */
  readonly sizeInBytes: number;

  /** Huella SHA-256 con formato sha256:<hex>. */
  readonly integrity: string;
}

export interface ArtifactManifest {
  readonly artifact: Artifact;

  /**
   * Relative paths produced by the build.
   * Each path may refer to either a file or a directory.
   */
  readonly outputs: readonly string[];

  /** Huellas de integridad de los outputs publicados. */
  readonly outputFingerprint?: readonly OutputFingerprint[];

  readonly createdAt: number;
  readonly schemaVersion: number;
}
