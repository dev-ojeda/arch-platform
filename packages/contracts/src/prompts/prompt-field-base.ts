// prompt-field-base.ts

import type { PromptValues } from './prompt-values.js'

export interface PromptFieldBase<
    TType,
    TValue
> {
    type: TType

    name: string

    message: string

    description?: string

    required?: boolean

    defaultValue?: TValue

    when?: (
        values: PromptValues
    ) => boolean | Promise<boolean>

    transform?: (
        value: TValue
    ) => TValue | Promise<TValue>

    validate?: (
        value: TValue,
        values: PromptValues
    ) =>
        | string
        | undefined
        | Promise<string | undefined>
}