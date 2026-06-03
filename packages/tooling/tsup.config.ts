// packages/tooling/tsup.config.ts

import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.js';

const COMMAND_ENTRIES = {
  // public command API
  'commands/build': 'src/commands/build.ts',
  'commands/clean': 'src/commands/clean.ts',
  'commands/dev': 'src/commands/dev.ts',
  'commands/lint': 'src/commands/lint.ts',
  'commands/typecheck': 'src/commands/typecheck.ts',
} as const;
const RUNTIME_ENTRIES = {
  'runtime/execute-command': 'src/runtime/execute-command.ts',
};
const ENTRYPOINTS = {
  index: 'src/index.ts',
  ...COMMAND_ENTRIES,
  ...RUNTIME_ENTRIES,
} as const;

export default defineConfig({
  ...baseConfig,

  entry: ENTRYPOINTS,

  bundle: true,
  dts: false,
  sourcemap: false,
  splitting: false,
  treeshake: false,
});
