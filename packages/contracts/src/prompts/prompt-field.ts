// prompt-field.ts

import type { StringField } from './string-field.js'
import type { BooleanField } from './boolean-field.js'
import type { SelectField } from './select-field.js'

export type PromptField =
    | StringField
    | BooleanField
    | SelectField