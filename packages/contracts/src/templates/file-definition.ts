// packages\contracts\src\templates\file-definition.ts
import type {
    OverwritePolicy
} from '../filesystem/overwrite-policy.js'

import type {
    NamedVariables
} from '../variables/named-variables.js'

import type {
    FileHookContext
} from '../generators/generator-hooks.js'

export interface FileDefinition<
    TVariables extends NamedVariables =
        NamedVariables
> {

    template: string

    output: string

    condition?: (
        variables: TVariables
    ) =>
        | boolean
        | Promise<boolean>

    overwrite?: OverwritePolicy

    transform?: (
        content: string,
        variables: TVariables
    ) =>
        | string
        | Promise<string>

    beforeWrite?: (
        ctx: FileHookContext<TVariables>
    ) => Promise<void>

    afterWrite?: (
        ctx: FileHookContext<TVariables>
    ) => Promise<void>
}