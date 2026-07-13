// packages/tooling/src/commands/clean/create-paths-to-remove.ts

import { join } from 'path';

import type { CleanCommandOptions } from '../common/command-options.js';

export function createPathsToRemove(
  cwd: string,
  options: Required<Omit<CleanCommandOptions, 'cwd'>>,
): readonly string[] {
  const paths: string[] = [];

  if (options.removeDist) {
    paths.push(join(cwd, 'dist'));
  }

  if (options.removeCoverage) {
    paths.push(join(cwd, 'coverage'));
  }

  if (options.removeTurbo) {
    paths.push(join(cwd, '.turbo'));
  }

  return paths;
}
