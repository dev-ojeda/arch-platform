// config/paths/workspace.ts

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

export const APPS_ROOT = resolve(WORKSPACE_ROOT, 'apps');

export const DOCS_ROOT = resolve(WORKSPACE_ROOT, 'docs');

export const SCRIPTS_ROOT = resolve(WORKSPACE_ROOT, 'scripts');
