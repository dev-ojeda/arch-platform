import type { LanguageConvention } from "./language-convention.js"

export interface LanguageConventionRegistry {

    get(
        id: string
    ): LanguageConvention

    list():
        LanguageConvention[]
}