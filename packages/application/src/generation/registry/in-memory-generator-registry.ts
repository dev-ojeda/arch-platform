import type { GeneratorDefinition, GeneratorRegistry } from '@arch/contracts/generators';

export class InMemoryGeneratorRegistry implements GeneratorRegistry {
  readonly #generators = new Map<string, GeneratorDefinition>();

  has(id: string): Promise<boolean> {
    return Promise.resolve(this.#generators.has(id));
  }

  register(generator: GeneratorDefinition): void {
    const id = generator.descriptor.id;

    if (this.#generators.has(id)) {
      throw new Error(`Generator "${id}" already registered`);
    }

    this.#generators.set(id, generator);
  }

  get(id: string): Promise<GeneratorDefinition> {
    const generator = this.#generators.get(id);

    if (generator === undefined) {
      throw new Error(`Generator "${id}" not found`);
    }

    return Promise.resolve(generator);
  }

  list(): Promise<readonly GeneratorDefinition[]> {
    return Promise.resolve([...this.#generators.values()]);
  }
}
