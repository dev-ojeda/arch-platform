// config/paths/packages.ts

import { resolve } from 'node:path';

import { PACKAGES_ROOT } from './workspace.js';

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

/**
 * Test directory.
 */
export function packageTests(name: PlatformPackage): string {
  return resolve(packageRoot(name), 'test');
}

/**
 * Distribution directory.
 */
export function packageDist(name: PlatformPackage): string {
  return resolve(packageRoot(name), 'dist');
}
