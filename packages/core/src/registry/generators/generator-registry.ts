// packages/core/src/registry/generator-registry.ts

import {
  eraseGeneratorType,
  restoreGeneratorType,
  type GeneratorDefinition,
  type RegisteredGeneratorDefinition,
} from '@arch/contracts/generators';
import type { NamedVariables } from '@arch/contracts/variables';

export class GeneratorRegistry {
  readonly #registry = new Map<string, RegisteredGeneratorDefinition>();

  register<TVariables extends NamedVariables>(generator: GeneratorDefinition<TVariables>): void {
    const id = generator.descriptor.id;

    if (this.#registry.has(id)) {
      throw new Error(`Generator already registered: ${id}`);
    }

    this.#registry.set(id, eraseGeneratorType(generator));
  }

  has(id: string): boolean {
    return this.#registry.has(id);
  }

  get<TVariables extends NamedVariables>(id: string): GeneratorDefinition<TVariables> | undefined {
    return restoreGeneratorType<TVariables>(this.#registry.get(id));
  }

  list(): RegisteredGeneratorDefinition[] {
    return [...this.#registry.values()];
  }
}
