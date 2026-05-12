// prompt-schema.ts

import type { PromptField } from './prompt-field.js'

export interface PromptSchema {
    id: string

    title: string

    description?: string

    version?: string

    fields: PromptField[]
}