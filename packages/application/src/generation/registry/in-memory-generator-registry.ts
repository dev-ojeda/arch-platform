import type { GeneratorDefinition, GeneratorRegistry } from '@arch/contracts';

export class InMemoryGeneratorRegistry implements GeneratorRegistry {
  private readonly generators = new Map<string, GeneratorDefinition>();

  async has(id: string): Promise<boolean> {
    return this.generators.has(id);
  }

  register(generator: GeneratorDefinition): void {
    const id = generator.descriptor.id;

    if (this.generators.has(id)) {
      throw new Error(`Generator "${id}" already registered`);
    }

    this.generators.set(id, generator);
  }

  async get(id: string): Promise<GeneratorDefinition> {
    const generator = this.generators.get(id);

    if (!generator) {
      throw new Error(`Generator "${id}" not found`);
    }

    return generator;
  }

  async list(): Promise<readonly GeneratorDefinition[]> {
    return [...this.generators.values()];
  }
}
