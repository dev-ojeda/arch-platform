// packages/application/src/generation/steps/__tests__/resolve-templates.step.test.ts

import {
  describe,
  expect,
  it
}
  from 'vitest'

import type {
  PipelineContext
}
  from '@arch/contracts'

import {
  ResolveTemplatesStep
}
  from '../resolve-templates.step.js'

import {
  testGenerator
}
  from '../../../../testing/test-generator.js'
import { createTestPipelineContext } from '@arch/testing'

describe(
  'ResolveTemplatesStep',
  () => {

    it(
      'resolves generator templates',
      async () => {

        const context:
          PipelineContext = {

          ...createTestPipelineContext(),

          generator:
            testGenerator
        }

        const step =
          new ResolveTemplatesStep()

        await step.execute(
          context
        )

        expect(
          context.resolvedTemplates
        ).toBeDefined()

        expect(
          context.resolvedTemplates
        ).toHaveLength(
          testGenerator.templates.length
        )

        expect(
          context.resolvedTemplates
        ).toEqual(

          expect.arrayContaining([

            expect.objectContaining({

              outputPath:
                expect.any(String),

              template:
                expect.any(Object)
            })
          ])
        )
      }
    )
  }
)