// packages\core\src\templates\language-registry.ts
import type { LanguageConvention } from '@arch/contracts/languages';

const registry = new Map<string, LanguageConvention>();

export function registerLanguage(adapter: LanguageConvention) {
  registry.set(adapter.id, adapter);
}

export function getLanguage(id: string): LanguageConvention {
  const adapter = registry.get(id);

  if (!adapter) {
    throw new Error(`Language '${id}' not supported`);
  }

  return adapter;
}
