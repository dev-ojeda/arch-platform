// packages/tooling/src/commands/clean/create-paths-to-remove.ts

import path from 'path';

import type { CleanCommandOptions } from './clean-command-options.js';

export function createPathsToRemove(
  cwd: string,
  options: Required<Omit<CleanCommandOptions, 'cwd'>>,
): readonly string[] {
  const paths: string[] = [];

  if (options.removeDist) {
    paths.push(path.join(cwd, 'dist'));
  }

  if (options.removeCoverage) {
    paths.push(path.join(cwd, 'coverage'));
  }

  if (options.removeTurbo) {
    paths.push(path.join(cwd, '.turbo'));
  }

  return paths;
}
