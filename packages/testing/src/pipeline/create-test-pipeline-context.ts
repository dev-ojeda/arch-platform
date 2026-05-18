// packages\testing\src\pipeline\create-test-pipeline-context.ts
import type {
  PipelineContext
}
from '@arch/contracts'

import {
  createTestContext
}
from '../runtime/create-test-context.js'

export function createTestPipelineContext():
PipelineContext {

  return {

    ...createTestContext(),

    generatorId:
      'test-generator'
  }
}