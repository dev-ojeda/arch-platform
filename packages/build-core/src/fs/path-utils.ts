// packages/build-core/src/fs/path-utils.ts

import { dirname, join, relative, resolve } from 'node:path';

export function joinPath(...segments: string[]): string {
  return join(...segments);
}

export function packagePath(root: string, ...segments: string[]): string {
  return join(root, ...segments);
}

export function getStatePath(workspaceRoot: string): string {
  return statePath(workspaceRoot);
}
export function srcPath(root: string): string {
  return packagePath(root, 'src');
}

export function distPath(root: string): string {
  return packagePath(root, 'dist');
}

export function dirName(dirPath: string): string {
  return dirname(dirPath);
}

export function statePath(workspaceRoot: string): string {
  return join(workspaceRoot, '.arch', 'state.json');
}
export function resolvePath(...segments: string[]): string {
  return resolve(...segments);
}

export function relativePath(from: string, to: string): string {
  return relative(from, to);
}
