// packages/core/src/registry/generator-registry.ts

import type {
  GeneratorDefinition,
  NamedVariables,
  RegisteredGeneratorDefinition,
  GeneratorRegistry as GeneratorRegistryContract,
} from '@arch-platform/contracts';

import { DuplicateGeneratorError } from '../../errors/registry/duplicate-generator.error.js';

export class GeneratorRegistry implements GeneratorRegistryContract {
  readonly #registry = new Map<string, RegisteredGeneratorDefinition>();

  register<TVariables extends NamedVariables>(generator: GeneratorDefinition<TVariables>): void {
    const id = generator.descriptor.id;

    if (this.#registry.has(id)) {
      throw new DuplicateGeneratorError(id);
    }

    this.#registry.set(id, this.eraseGeneratorType(generator));
  }

  has(id: string): boolean {
    return this.#registry.has(id);
  }

  get(id: string): RegisteredGeneratorDefinition | undefined {
    return this.#registry.get(id);
  }

  list(): readonly RegisteredGeneratorDefinition[] {
    return [...this.#registry.values()];
  }

  private eraseGeneratorType<TVariables extends NamedVariables>(
    generator: GeneratorDefinition<TVariables>,
  ): RegisteredGeneratorDefinition {
    return generator as RegisteredGeneratorDefinition;
  }
}
