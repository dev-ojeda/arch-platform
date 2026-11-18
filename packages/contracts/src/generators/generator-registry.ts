// packages/contracts/src/generators/generator-registry.ts

import type { GeneratorDefinition } from './generator-definition.js';
import type { RegisteredGeneratorDefinition } from './generator-type-erasure.js';
import type { NamedVariables } from '../variables/named-variables.js';

export interface GeneratorRegistry {
  register<TVariables extends NamedVariables>(generator: GeneratorDefinition<TVariables>): void;

  get(id: string): RegisteredGeneratorDefinition | undefined;

  has(id: string): boolean;

  list(): readonly RegisteredGeneratorDefinition[];
}
