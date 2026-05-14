import type {
  VariableValue
} from '../variables/named-variables.js'

export interface FolderLayout {

  [key: string]: VariableValue

  controller: string

  service: string

  repository: string

  model: string
}