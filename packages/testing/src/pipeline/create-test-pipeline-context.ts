// packages/testing/src/pipeline/create-test-pipeline-context.ts

import type {

  NamedVariables,

  PipelineContext

}
from '@arch/contracts'

import {
  createTestContext
}
from '../runtime/create-test-context.js'

export interface CreateTestPipelineContextOptions {

  variables?:
    NamedVariables
}

export function
createTestPipelineContext(

  options:
  CreateTestPipelineContextOptions = {}

): PipelineContext {

  return {

    ...createTestContext({

      variables:
        options.variables
    }),

    generatorId:
      'test-generator'
  }
}