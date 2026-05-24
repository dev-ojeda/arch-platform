// apps\vscode-extension\src\composition\create-language-registry.ts

import { LanguageConventionRegistry, TypeScriptConvention } from '@arch/core';

export function createLanguageRegistry(): LanguageConventionRegistry {
  const registry = new LanguageConventionRegistry();

  registry.register(new TypeScriptConvention());

  return registry;
}
