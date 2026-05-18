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
from '@arch/testing'

import {
  createTestPipelineContext
}
from '@arch/testing'

describe(
  'ResolveTemplatesStep',
  () => {

    it(
      'resolves generator templates',
      async () => {

        const context:
        PipelineContext = {

          ...createTestPipelineContext({

            variables: {

              name: 'user'
            }
          }),

          generator:
            testGenerator,

          resolvedVariables: {

            name:
              'user',

            className:
              'User',

            controllerName:
              'UserController',

            serviceName:
              'UserService',

            repositoryName:
              'UserRepository',

            modelName:
              'User',

            fileExtension:
              '.ts',

            folderLayout: {

              controller:
                'controllers',

              service:
                'services',

              repository:
                'repositories',

              model:
                'models'
            }
          }
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