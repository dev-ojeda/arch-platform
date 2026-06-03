// packages/contracts/src/variables/build-types.ts

import type { GeneratorDefinition } from '../generators/generator-definition.js';

import type { NamedVariables } from './named-variables.js';

export type RegisteredGeneratorDefinition = GeneratorDefinition<NamedVariables>;
export function eraseGeneratorType<TVariables extends NamedVariables>(
  generator: GeneratorDefinition<TVariables>,
): RegisteredGeneratorDefinition {
  return generator as RegisteredGeneratorDefinition;
}

export function restoreGeneratorType<TVariables extends NamedVariables>(
  generator: RegisteredGeneratorDefinition | undefined,
): GeneratorDefinition<TVariables> | undefined {
  return generator;
}
