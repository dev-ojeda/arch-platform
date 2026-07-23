// packages/platform-model/src/index.ts
export type { DependencyMatrix, Layer } from './architecture/index.js';
export { ARTIFACT_SCHEMA_VERSION } from './artifact/index.js';
export type {
  Artifact,
  ArtifactLayout,
  ArtifactLayoutFactory,
  ArtifactManifest,
} from './artifact/index.js';
export type { Diagnostic, DiagnosticLocation, DiagnosticSeverity } from './diagnostics/index.js';
export type {
  CycleDetectionResult,
  DagNode,
  Graph,
  MutableDagNode,
  MutableGraph,
} from './graph/index.js';
export { HASH_SCHEMA_VERSION } from './hashing/index.js';
export type { HashContext, HashInput, HashResult, HashValidation } from './hashing/index.js';
export type {
  PackageBoundaries,
  PackageBuildConfig,
  PackageDescriptor,
  PackageJson,
  PackageLayout,
  PackageManifest,
  PackageMetadata,
  PackageProvider,
} from './package/index.js';
export type {
  ArtifactCache,
  ArtifactProvider,
  ArtifactPublisher,
  OutputValidator,
} from './ports/index.js';
export type { MaybePromise } from './types/index.js';
export type {
  WorkspaceDescriptor,
  WorkspaceGraph,
  WorkspaceLayout,
  WorkspacePackage,
  WorkspaceProvider,
} from './workspace/index.js';
