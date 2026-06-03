// packages/contracts/src/generators/generator-module.ts

import type { GeneratorRegistry } from './generator-registry.js';

export interface GeneratorModule {
  register(registry: GeneratorRegistry): void | Promise<void>;
}
