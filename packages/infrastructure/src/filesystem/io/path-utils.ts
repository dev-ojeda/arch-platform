// packages/infrastructure/src/filesystem/io/path-utils.ts

import { basename, dirname, isAbsolute, join, normalize, relative, resolve } from 'node:path';

export function joinPath(...segments: string[]): string {
  return join(...segments);
}

export function packagePath(root: string, ...segments: string[]): string {
  return join(root, ...segments);
}
function configContentPath(root: string, ...segments: string[]): string {
  return join(root, ...segments);
}
export function getStatePath(workspaceRoot: string): string {
  return statePath(workspaceRoot);
}

export function configPath(root: string): string {
  return configContentPath(root, 'config');
}

export function srcPath(root: string): string {
  return packagePath(root, 'src');
}

export function distPath(root: string): string {
  return packagePath(root, 'dist');
}
export function testPath(root: string): string {
  return packagePath(root, 'test');
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

export function isAbsolutePath(targetPath: string): boolean {
  return isAbsolute(targetPath);
}
export function baseName(targetPath: string): string {
  return basename(targetPath);
}
export function normalizePath(targetPath: string): string {
  return normalize(targetPath);
}
