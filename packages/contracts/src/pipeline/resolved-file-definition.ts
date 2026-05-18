// packages/contracts/src/pipeline/resolved-file-definition.ts

import type {
  FileDefinition
}
from '../templates/file-definition.js'

import type {
  ResolvedTemplateVariables
}
from '../templates/resolved-template-variables.js'

import type {
  NamedVariables
}
from '../variables/named-variables.js'

export type ResolvedFileDefinition =

  FileDefinition<
    ResolvedTemplateVariables<
      NamedVariables
    >
  >