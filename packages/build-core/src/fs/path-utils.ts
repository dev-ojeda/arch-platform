// packages/build-core/src/fs/path-utils.ts

import path from 'node:path';

export function joinPath(...segments: string[]): string {
  return path.join(...segments);
}

export function packagePath(root: string, ...segments: string[]): string {
  return path.join(root, ...segments);
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
  return path.dirname(dirPath);
}

export function statePath(workspaceRoot: string): string {
  return path.join(workspaceRoot, '.arch', 'state.json');
}
export function resolvePath(...segments: string[]): string {
  return path.resolve(...segments);
}

export function relativePath(from: string, to: string): string {
  return path.relative(from, to);
}
