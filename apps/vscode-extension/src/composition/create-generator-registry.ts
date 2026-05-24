// apps\vscode-extension\src\composition\create-generator-registry.ts
import { GeneratorRegistry } from '@arch/core';
import { registerMvcGenerator } from '@arch/generator-mvc';

export function createGeneratorRegistry(): GeneratorRegistry {
  const registry = new GeneratorRegistry();

  registerMvcGenerator(registry);

  return registry;
}
