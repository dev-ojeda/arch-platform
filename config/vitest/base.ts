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
  'application',
  'build-core',
  'cli',
  'code-analysis',
  'contracts',
  'core',
  'domain-order',
  'governance',
  'infrastructure',
  'platform-model',
  'testing',
  'tooling',
  'compliance',
] as const;

export type PlatformPackage = (typeof PLATFORM_PACKAGES)[number];

/**
 * Package root.
 */
export function packageRoot(name: PlatformPackage): string {
  return resolve(PACKAGES_ROOT, name);
}

/**
 * Source directory.
 */
export function packageSource(name: PlatformPackage): string {
  return resolve(packageRoot(name), 'src');
}
