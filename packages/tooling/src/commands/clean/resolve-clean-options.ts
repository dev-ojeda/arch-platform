// packages/tooling/src/runtime/clean/resolve-clean-options.ts

import { DEFAULT_CLEAN_OPTIONS, type CleanCommandOptions } from '../common/command-options.js';

export function resolveCleanOptions(
  options: CleanCommandOptions = {},
): Required<CleanCommandOptions> {
  return {
    ...DEFAULT_CLEAN_OPTIONS,
    ...options,
    cwd: options.cwd ?? process.cwd(),
  };
}
