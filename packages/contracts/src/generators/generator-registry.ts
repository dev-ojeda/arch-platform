import type { GeneratorDefinition } from './generator-definition.js';

export interface GeneratorRegistry {
  register(generator: GeneratorDefinition): void;

  get(id: string): Promise<GeneratorDefinition>;

  has(id: string): Promise<boolean>;

  list(): Promise<readonly GeneratorDefinition[]>;
}
