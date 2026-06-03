// packages/contracts/src/generators/generator-type-erasure.ts

import type { NamedVariables } from '../variables/named-variables.js';

import type { GeneratorDefinition } from './generator-definition.js';

export type RegisteredGeneratorDefinition = GeneratorDefinition<NamedVariables>;

/**
 * Erases the concrete variable type so heterogeneous
 * generator definitions can be stored in registries.
 */
export function eraseGeneratorType<TVariables extends NamedVariables>(
  generator: GeneratorDefinition<TVariables>,
): RegisteredGeneratorDefinition {
  return generator as RegisteredGeneratorDefinition;
}

/**
 * Restores the expected variable type.
 *
 * The caller is responsible for requesting the
 * correct variable type.
 */
export function restoreGeneratorType<TVariables extends NamedVariables>(
  generator: RegisteredGeneratorDefinition | undefined,
): GeneratorDefinition<TVariables> | undefined {
  return generator;
}
