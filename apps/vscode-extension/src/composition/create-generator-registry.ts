// apps\vscode-extension\src\composition\create-generator-registry.ts
import { GeneratorRegistry } from '@arch-platform/core';
import { registerMvcGenerator } from '@arch-platform/generator-mvc';

export function createGeneratorRegistry(): GeneratorRegistry {
  const registry = new GeneratorRegistry();

  registerMvcGenerator(registry);

  return registry;
}
