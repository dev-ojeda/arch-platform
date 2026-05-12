// packages\contracts\src\generators\generator-definition.ts

import type { PromptSchema } from '../prompts/prompt-schema.js'
import type { FileDefinition  } from '../template.js'
import type { NamedVariables } from '../variables.js'
import type { FileHookContext } from './generator-hooks.js'
import type {
    GeneratorCapabilities
} from './generator-capabilities.js'

export interface GeneratorDefinition<
    TValues extends NamedVariables =
        NamedVariables
> {
    id: string

    name: string

    description?: string

    version: string

    schema: PromptSchema

    templates: FileDefinition[]

    hooks?: FileHookContext<TValues>

    capabilities?: GeneratorCapabilities

    metadata?: Record<string, unknown>
}