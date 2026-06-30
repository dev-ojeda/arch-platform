// packages/core/src/registry/generator-registry.ts

import {
  type GeneratorDefinition,
  type NamedVariables,
  type RegisteredGeneratorDefinition,
} from '@arch/contracts';

export class GeneratorRegistry {
  readonly #registry = new Map<string, RegisteredGeneratorDefinition>();

  register<TVariables extends NamedVariables>(generator: GeneratorDefinition<TVariables>): void {
    const id = generator.descriptor.id;

    if (this.#registry.has(id)) {
      throw new Error(`Generator already registered: ${id}`);
    }

    this.#registry.set(id, this.eraseGeneratorType(generator));
  }

  has(id: string): boolean {
    return this.#registry.has(id);
  }

  get<TVariables extends NamedVariables>(id: string): GeneratorDefinition<TVariables> | undefined {
    return this.restoreGeneratorType<TVariables>(this.#registry.get(id));
  }

  list(): RegisteredGeneratorDefinition[] {
    return [...this.#registry.values()];
  }
  /**
   * Erases the concrete variable type so heterogeneous
   * generator definitions can be stored in registries.
   */
  private eraseGeneratorType<TVariables extends NamedVariables>(
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
  private restoreGeneratorType<TVariables extends NamedVariables>(
    generator: RegisteredGeneratorDefinition | undefined,
  ): GeneratorDefinition<TVariables> | undefined {
    return generator;
  }
}
