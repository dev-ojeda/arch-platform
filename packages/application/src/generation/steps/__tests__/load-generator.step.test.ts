// packages\application\src\generation\steps\__tests__\load-generator.step.test.ts
import {
  describe,
  expect,
  it
} from 'vitest'
import { TestPipelineBuilder } from '../../../../testing/test-pipeline-builder.js'
import { testGenerator } from '@arch/testing'

describe(
  'LoadGeneratorStep',
  () => {

    it(
      'loads generator into context',
      async () => {

        const context =
          await new TestPipelineBuilder()

            .withGenerator(
              testGenerator
            )

            .execute()

        expect(
          context.generator
        ).toBeDefined()

        expect(
          context.generator?.descriptor.id
        ).toBe(
          'test-generator'
        )
      }
    )
  }
)