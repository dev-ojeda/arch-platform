// packages\contracts\src\generator-metadata.ts
import type {
    NamedVariables
} from '../variables.js'

import type {
    Generator
} from './generator.js'
import type { GeneratorField } from './generator-schema.js'

export interface GeneratorMetadata<
    TVariables extends NamedVariables
> {

    id: string

    displayName: string

    description?: string

    languages: readonly string[]

    frameworks: readonly string[]

    generator: Generator<TVariables>

    fields?: readonly GeneratorField[]
}