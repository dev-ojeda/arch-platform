// packages\contracts\src\generator.ts

import type { GenerationContext } from '../runtime/generation-context.js'
import type {
  NamedVariables
} from '../variables.js'

export interface Generator<
  TVariables extends NamedVariables =
      NamedVariables
> {
  name: string

  generate(
      ctx: GenerationContext<TVariables>
  ): Promise<void>
}