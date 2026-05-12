// packages\core\src\templates\language-registry.ts
import type { LanguageAdapter } from '@arch/contracts'

const registry = new Map<string, LanguageAdapter>()

export function registerLanguage(
    adapter: LanguageAdapter
) {
    registry.set(adapter.id, adapter)
}

export function getLanguage(
    id: string
): LanguageAdapter {

    const adapter = registry.get(id)

    if (!adapter) {
        throw new Error(
            `Language '${id}' not supported`
        )
    }

    return adapter
}