// packages\contracts\src\runtime\generation-context.ts
import type {
    FileSystemPort
} from '../filesystem/filesystem.port.js'

import type {
    LoggerPort
} from '../logging/logger.port.js'

import type {
    TechnologyStack
} from '../stacks/technology-stack.js'

import type {
    NamedVariables
} from '../variables/named-variables.js'

export interface GenerationContext<
    TVariables extends NamedVariables =
    NamedVariables
> {

    readonly variables:
        TVariables

    readonly targetDir:
        string

    readonly logger:
        LoggerPort

    readonly fs:
        FileSystemPort

    readonly stack:
        TechnologyStack

    readonly signal?:
        AbortSignal
}