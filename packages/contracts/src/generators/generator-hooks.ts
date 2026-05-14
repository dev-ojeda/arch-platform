// packages/contracts/src/generators/generator-hooks.ts

import type { NamedVariables }
from '../variables/named-variables.js'

export interface FileHookContext<
    TValues extends NamedVariables =
        NamedVariables
> {
    variables: TValues

    outputPath: string

    content: string
}

export interface GeneratorHooks<
    TValues extends NamedVariables =
        NamedVariables
> {
    beforeGenerate?: (
        variables: TValues
    ) => Promise<void>

    afterGenerate?: (
        variables: TValues
    ) => Promise<void>
}