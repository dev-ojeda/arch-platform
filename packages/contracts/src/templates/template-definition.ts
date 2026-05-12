// template-definition.ts

import type { PromptValues } from '../prompts/prompt-values.js'

export interface TemplateDefinition {
    source: string

    destination: string

    overwrite?: boolean

    skipIfExists?: boolean

    condition?: (
        values: PromptValues
    ) => boolean | Promise<boolean>
}