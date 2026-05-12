import {
    registerLanguage
} from './registry.js'

import {
    TypeScriptAdapter
} from './adapters/typescript.adapter.js'

export function bootstrapLanguageRegistry(): void {

    registerLanguage(
        new TypeScriptAdapter()
    )
}