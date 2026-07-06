// packages/build-core/src/workspace/index.ts

export { discoverWorkspacePackages } from '../discovery/discover-packages-root.js';
export { IGNORED_DIRECTORIES } from '../discovery/ignored-directories.js';
export type { PackageJson } from '../package/package-json.js';
export { readPackageJson } from '../package/read-package-json.js';
export { findWorkspaceRoot } from './find-workspace-root.js';
export type { WorkspaceContext } from './workspace-context.js';
export type { WorkspaceGraphNode } from './workspace-graph-node.js';
export type { WorkspaceGraph } from './workspace-graph.js';
export type { WorkspaceProvider } from './workspace-provider.js';
