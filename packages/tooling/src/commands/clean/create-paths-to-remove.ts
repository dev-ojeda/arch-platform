// packages/tooling/src/commands/clean/create-paths-to-remove.ts

import { joinPath } from '@arch/infrastructure';

import type { CleanCommandOptions } from '../common/command-options.js';

export function createPathsToRemove(
  cwd: string,
  options: Required<Omit<CleanCommandOptions, 'cwd'>>,
): readonly string[] {
  const paths: string[] = [];

  if (options.removeDist) {
    paths.push(joinPath(cwd, 'dist'));
  }

  if (options.removeCoverage) {
    paths.push(joinPath(cwd, 'coverage'));
  }

  if (options.removeTurbo) {
    paths.push(joinPath(cwd, '.turbo'));
  }

  return paths;
}
