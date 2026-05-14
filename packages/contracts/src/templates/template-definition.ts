// packages\contracts\src\templates\template-definition.ts

import type { PromptValues } from '../prompts/prompt-values.js'

export interface TemplateDefinition {
    templatePath: string

    outputPath: string

    overwrite?: boolean

    skipIfExists?: boolean

    condition?: (
        values: PromptValues
    ) => boolean | Promise<boolean>
}