// string-field.ts

import type { PromptFieldBase } from './prompt-field-base.js'

export interface StringField
    extends PromptFieldBase<'string', string> {

    minLength?: number

    maxLength?: number

    pattern?: RegExp
}