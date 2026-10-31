// packages/tooling/src/commands/clean/create-paths-to-remove.ts

import { packagePath } from '@arch-platform/infrastructure';

import type { CleanCommandOptions } from '../common/command-options.js';

export function createPathsToRemove(
  cwd: string,
  options: Required<Omit<CleanCommandOptions, 'cwd'>>,
): readonly string[] {
  const paths: string[] = [];

  if (options.removeDist) paths.push(packagePath(cwd, 'dist'));
  if (options.removeCoverage) paths.push(packagePath(cwd, 'coverage'));

  return paths;
}
