// packages/contracts/src/generators/generator-registry.ts

import type { TemplateVariables } from '../variables/template-variables.js';

import type { GeneratorDefinition } from './generator-definition.js';

export interface GeneratorRegistry {
  register<TValues extends TemplateVariables>(generator: GeneratorDefinition<TValues>): void;

  get<TValues extends TemplateVariables>(id: string): Promise<GeneratorDefinition<TValues>>;

  list(): Promise<readonly GeneratorDefinition[]>;
}
