// select-field.ts

import type { PromptFieldBase } from './prompt-field-base.js'

export interface SelectOption {
    label: string
    value: string
}

export interface SelectField
    extends PromptFieldBase<'select', string> {

    options:
        | SelectOption[]
        | (() =>
            | Promise<SelectOption[]>
            | SelectOption[])
}