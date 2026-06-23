// packages\generators\mvc\tsup.config.tsi
import { defineConfig } from 'tsup';

import { libraryConfig } from '../../../tsup.library.js';

export default defineConfig({
  ...libraryConfig,

  entry: {
    index: 'src/index.ts',
  },
});
