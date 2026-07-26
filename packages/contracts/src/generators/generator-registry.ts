// packages/contracts/src/generators/generator-registry.ts

import type { GeneratorDefinition } from './generator-definition.js';
import type { TemplateVariables } from '../variables/template-variables.js';


export interface GeneratorRegistry {
  register<TValues extends TemplateVariables>(generator: GeneratorDefinition<TValues>): void;

  get<TValues extends TemplateVariables>(id: string): Promise<GeneratorDefinition<TValues>>;

  list(): Promise<readonly GeneratorDefinition[]>;
}
