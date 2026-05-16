import type {
  PipelineContext
} from '@arch/contracts'

export function createTestPipelineContext():
PipelineContext {

  return {

    generatorId: 'test-generator',

    workspacePath: '/virtual-workspace',

    variables: {}
  }
}