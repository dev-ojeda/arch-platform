// packages/contracts/src/generators/generator-registry.ts

import type { NamedVariables } from '../variables/named-variables.js';

import type { GeneratorDefinition } from './generator-definition.js';

export interface GeneratorRegistry {
  register<TValues extends NamedVariables>(generator: GeneratorDefinition<TValues>): void;

  get(id: string): Promise<GeneratorDefinition | undefined>;

  list(): Promise<readonly GeneratorDefinition[]>;
}
