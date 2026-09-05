// packages\generators\mvc\src\registration\register.ts
import type { GeneratorModule } from '@arch-platform/contracts';

import { mvcGenerator } from '../definition/generate-mvc.js';

export const mvcModule: GeneratorModule = {
  register(registry) {
    registry.register(mvcGenerator);
  },
};
