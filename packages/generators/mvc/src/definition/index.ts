import type {
  GeneratorDefinition
} from '@arch/contracts'

import  {
  type MvcVariables
} from '../variables/mvc.variables.js'

import {
  mvcDescriptor
} from './descriptor.js'

import {
  mvcSchema
} from './schema.js'

import  {
  mvcFiles
} from './files.js'

export const mvcGenerator:
  GeneratorDefinition<MvcVariables> = {

  descriptor:
      mvcDescriptor,

  schema:
      mvcSchema,

  templates:
      mvcFiles
}