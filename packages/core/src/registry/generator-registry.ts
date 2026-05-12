// packages/core/src/registry/generator-registry.ts

import type {
  GeneratorDefinition,
  NamedVariables
} from '@arch/contracts'

const registry = new Map<
  string,
  GeneratorDefinition
>()

export function registerGenerator<
  TVariables extends NamedVariables
>(
  generator: GeneratorDefinition<TVariables>
): void {

  if (registry.has(generator.id)) {

      throw new Error(
          `Generator already registered: ${generator.id}`
      )
  }

  registry.set(
      generator.id,
      generator
  )
}

export function getGenerator(
  id: string
): GeneratorDefinition | undefined {

  return registry.get(id)
}

export function listGenerators():
  GeneratorDefinition[] {

  return Array.from(
      registry.values()
  )
}