// packages/contracts/src/templates/resolved-template-variables.ts

import type {
  FolderLayout
}
from '../languages/folder-layout.js'

import type {
  NamedVariables
}
from '../variables/named-variables.js'

export interface DerivedTemplateVariables
extends NamedVariables {

  readonly className: string

  readonly controllerName: string

  readonly serviceName: string

  readonly repositoryName: string

  readonly modelName: string

  readonly fileExtension: string

  readonly folderLayout: FolderLayout
}

export type ResolvedTemplateVariables<
  TVariables extends NamedVariables
> =
  TVariables &
  DerivedTemplateVariables