// packages/build-core/src/package/index.ts
export { findPackageRoots } from './find-package.js';
export type { PackageBuildConfig } from './package-config.js';
export type { PackageJson } from './package-json.js';
export type { PackageRoot } from './packages-root.js';
export { isPackageJson, readPackageJson } from './read-package-json.js';
export { resolvePackageOutputs } from './resolve-package-outputs.js';
