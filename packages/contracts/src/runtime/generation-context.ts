// packages\contracts\src\runtime\generation-context.ts
import type {
    FileSystemPort
} from '../filesystem/filesystem.port.js'

import type {
    Logger
} from '../logging/logger.js'

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

    variables:
    TVariables

    targetDir:
    string

    logger:
    Logger

    fs:
    FileSystemPort

    stack:
    TechnologyStack

    signal?:
    AbortSignal
}