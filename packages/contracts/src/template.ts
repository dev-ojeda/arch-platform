// packages/contracts/src/template.ts

import type { OverwritePolicy } from './filesystem.js'
import type { FileHookContext } from './generators/generator-hooks.js'
import type { NamedVariables } from './variables.js'

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