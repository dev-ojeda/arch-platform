import { resolve } from 'node:path';

/**
 * Workspace root.
 */
export const WORKSPACE_ROOT = resolve(import.meta.dirname, '../..');

/**
 * Top-level directories.
 */
export const CONFIG_ROOT = resolve(WORKSPACE_ROOT, 'config');

export const PACKAGES_ROOT = resolve(WORKSPACE_ROOT, 'packages');

export const ESLINT_ROOT = resolve(CONFIG_ROOT, 'eslint');

export const TSUP_ROOT = resolve(CONFIG_ROOT, 'tsup');

export const TSCONFIG_ROOT = resolve(CONFIG_ROOT, 'tsconfig');

export const PLATFORM_PACKAGES = [
  { name: 'application', path: 'application' },
  { name: 'build-core', path: 'build-core' },
  { name: 'cli', path: 'cli' },
  { name: 'code-analysis', path: 'code-analysis' },
  { name: 'compliance', path: 'compliance' },
  { name: 'contracts', path: 'contracts' },
  { name: 'core', path: 'core' },
  { name: 'distribution', path: 'distribution' },
  { name: 'domain-order', path: 'domain-order' },
  { name: 'generator-mvc', path: 'generators/mvc' },
  { name: 'governance', path: 'governance' },
  { name: 'infrastructure', path: 'infrastructure' },
  { name: 'platform-model', path: 'platform-model' },
  { name: 'tooling', path: 'tooling' },
] as const;

/**
 * Package root.
 */
export function packageRoot(relativePath) {
  return resolve(PACKAGES_ROOT, relativePath);
}

/**
 * Source directory.
 */
export function packageSource(relativePath) {
  return resolve(packageRoot(relativePath), 'src');
}
