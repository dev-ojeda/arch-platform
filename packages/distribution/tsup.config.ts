// packages/distribution/tsup.config.ts
import { createLibraryConfig } from '../../config/tsup/library.js';

export default createLibraryConfig({
  tsconfig: './tsconfig.json',
});
