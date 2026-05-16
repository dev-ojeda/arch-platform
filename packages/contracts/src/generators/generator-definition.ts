// packages\contracts\src\generators\generator-definition.ts
import type {
    PromptSchema
} from '../prompts/prompt-schema.js'

import type {
    FileDefinition
} from '../templates/file-definition.js'
import type { ResolvedTemplateVariables } from '../templates/resolved-template-variables.js'

import type {
    NamedVariables
} from '../variables/named-variables.js'

import type {
    GeneratorCapabilities
} from './generator-capabilities.js'

import type {
    GeneratorDescriptor
} from './generator-descriptor.js'

import type {
    GeneratorHooks
} from './generator-hooks.js'

export interface GeneratorDefinition<
    TValues extends NamedVariables =
    NamedVariables
> {

    readonly descriptor:
    GeneratorDescriptor

    readonly schema:
    PromptSchema<TValues>

    readonly templates:
    readonly FileDefinition<
        ResolvedTemplateVariables<TValues>
    >[]

    readonly hooks?:
    GeneratorHooks<TValues>

    readonly capabilities?:
    GeneratorCapabilities

    readonly metadata?:
    Readonly<
        Record<string, unknown>
    >
}