// packages\tooling\tsup.config.ts
import { defineConfig } from 'tsup';

import { baseConfig } from '../../tsup.base.ts';

export default defineConfig({
  ...baseConfig,
  tsconfig: './tsconfig.build.json',
  entry: {
    'commands/build': 'src/commands/build.ts',
    'commands/clean': 'src/commands/clean.ts',
    'commands/dev': 'src/commands/dev.ts',
    'commands/typecheck': 'src/commands/typecheck.ts',
    'commands/lint': 'src/commands/lint.ts',
    'runtime/execute-command': 'src/runtime/execute-command.ts',
  },
  dts: false,
});
