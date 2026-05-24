import type { GeneratorRegistry } from '@arch/core';

import { mvcGenerator } from '../definition/index.js';

export function registerMvcGenerator(registry: GeneratorRegistry): void {
  registry.register(mvcGenerator);
}
