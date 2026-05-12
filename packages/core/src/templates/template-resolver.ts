// packages\core\src\templates\template-resolver.ts

import * as path from 'path'

import type {
    StackDefinition
} from '@arch/contracts'

export function resolveTemplateDir(
    generatorRoot: string,
    stack: StackDefinition
) {
    return path.join(
        generatorRoot,
        'templates',
        stack.language,
        stack.framework ?? 'default'
    )
}