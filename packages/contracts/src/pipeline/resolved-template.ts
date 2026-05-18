import type {
  ResolvedFileDefinition
}
from './resolved-file-definition.js'

export interface ResolvedTemplate {

  template:
    ResolvedFileDefinition

  outputPath:
    string
}