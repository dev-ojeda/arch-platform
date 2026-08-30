// packages/platform-model/src/index.ts
export type {
  ArchitectureDescriptor,
  ArchitectureLayout,
  ArchitectureManifest,
  ArchitecturePackage,
  ArchitectureProvider,
  DependencyMatrix,
  Layer,
} from './architecture/index.js';
export type {
  Artifact,
  ArtifactLayout,
  ArtifactLayoutFactory,
  ArtifactManifest,
  ArtifactState,
  ArtifactStateReason,
  ArtifactStateStatus,
  ArtifactType,
} from './artifact/index.js';
export * from './compliance/index.js';
export type {
  ArtifactCompliance,
  ArtifactComplianceStatus,
  ComplianceState,
  ComplianceStateChange,
  ComplianceStateChanges,
} from './compliance/index.js';
export type { Diagnostic, DiagnosticLocation, DiagnosticSeverity } from './diagnostics/index.js';
export type {
  CycleDetectionResult,
  DagNode,
  Graph,
  MutableDagNode,
  MutableGraph,
} from './graph/index.js';
export type { HashContext, HashInput, HashResult, HashValidation } from './hashing/index.js';
export type {
  PackageBoundaries,
  PackageBuildConfig,
  PackageDescriptor,
  PackageLayout,
  PackageManifest,
  PackageMetadata,
  PackageProvider,
} from './package/index.js';
export type {
  ArtifactCache,
  ArtifactProvider,
  ArtifactPublisher,
  ArtifactStateReader,
  ArtifactStateWriter,
  ComplianceStateReader,
  ComplianceStateWriter,
  OutputValidator,
  StateLoader,
  StateWriter,
} from './ports/index.js';
export type { BuildState, BuildStateEntry, StateChanges } from './state/index.js';
export type { MaybePromise } from './types/index.js';
export type {
  WorkspaceDescriptor,
  WorkspaceGraph,
  WorkspaceLayout,
  WorkspacePackage,
  WorkspacePaths,
  WorkspaceProjector,
  WorkspaceProvider,
} from './workspace/index.js';
