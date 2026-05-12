// packages\contracts\src\runtime\generation-context.ts
import type { FileSystemAdapter } from "../filesystem.js"
import type { Logger } from "../logging/logger.js"
import type { StackDefinition } from "../stack.js"

export interface GenerationContext<
    TVariables extends object
> {
    variables: TVariables
    targetDir: string
    logger: Logger
    fs: FileSystemAdapter
    stack: StackDefinition
    signal?: AbortSignal
}