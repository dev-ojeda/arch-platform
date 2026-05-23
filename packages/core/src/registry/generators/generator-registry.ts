// packages/core/src/registry/generator-registry.ts

import type { GeneratorDefinition, NamedVariables } from '@arch/contracts';

export type AnyGeneratorDefinition = GeneratorDefinition<any>;

export class GeneratorRegistry {
  readonly #registry = new Map<string, AnyGeneratorDefinition>();

  register<TVariables extends NamedVariables>(generator: GeneratorDefinition<TVariables>): void {
    const id = generator.descriptor.id;

    if (this.#registry.has(id)) {
      throw new Error(`Generator already registered: ${id}`);
    }

    this.#registry.set(id, generator);
  }

  has(id: string): boolean {
    return this.#registry.has(id);
  }

  /**
   * Retrieves a generator definition.
   *
   * The caller is responsible for providing
   * the correct variable type.
   *
   * Internally the registry stores heterogeneous
   * generator definitions using type erasure.
   */
  get<TVariables extends NamedVariables>(id: string): GeneratorDefinition<TVariables> | undefined {
    const generator = this.#registry.get(id);

    return generator as GeneratorDefinition<TVariables> | undefined;
  }
  list(): AnyGeneratorDefinition[] {
    return [...this.#registry.values()];
  }
}
