// apps/vscode-extension/src/activate.ts

import {
    bootstrapLanguageRegistry
} from '@arch/language-registry'

export function registerBuiltInGenerators(): void {

    bootstrapLanguageRegistry()

    console.log(
        '[arch] generators registered'
    )
}