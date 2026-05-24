// vitest.workspace.ts

import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*/vitest.config.ts',

  'generators/*/vitest.config.ts',

  'plugins/*/vitest.config.ts',
]);
