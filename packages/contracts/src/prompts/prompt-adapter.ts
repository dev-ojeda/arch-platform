import type { NamedVariables } from "../variables/named-variables.js"
import type { BooleanField } from "./boolean-field.js"
import type { SelectField, SelectOption } from "./select-field.js"
import type { StringField } from "./string-field.js"

export interface PromptAdapter {

    input<
        TValues extends NamedVariables
    >(
        field: StringField<TValues>
    ): Promise<string | undefined>

    select<
        TValues extends NamedVariables
    >(
        field: SelectField<TValues>,

        options: SelectOption[]
    ): Promise<string | undefined>

    boolean<
        TValues extends NamedVariables
    >(
        field: BooleanField<TValues>
    ): Promise<boolean | undefined>
}
