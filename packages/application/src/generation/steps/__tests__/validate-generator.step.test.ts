import {
  describe,
  expect,
  it
} from 'vitest'

import {
  ValidateGeneratorStep
} from '../validate-generator.step.js'

import {
  GeneratorValidationError
} from '../../errors/generator-validation-error.js'

import type {
  PipelineContext
} from '@arch/contracts'

describe(
  'ValidateGeneratorStep',
  () => {

    it(
      'throws when generator is missing',
      async () => {

        const step =
          new ValidateGeneratorStep()

        const context =
          {} as PipelineContext

        await expect(

          step.execute(
            context
          )

        ).rejects.toThrow(

          GeneratorValidationError
        )
      }
    )
  }
)