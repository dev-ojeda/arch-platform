import type {
  FolderLayout
} from '../languages/folder-layout.js'

import type {
  NamedVariables
} from '../variables/named-variables.js'

export interface DerivedTemplateVariables
extends NamedVariables {

  className: string

  controllerName: string

  serviceName: string

  repositoryName: string

  modelName: string

  fileExtension: string

  folderLayout: FolderLayout
}

export type ResolvedTemplateVariables<
  TVariables extends NamedVariables
> =
  TVariables &
  DerivedTemplateVariables