// tsup.app.ts

import { baseConfig } from './tsup.base.js';

export const appConfig = {
  ...baseConfig,

  clean: true,

  external: [/^@arch\//],
};
