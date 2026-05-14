import type {
  NamedVariables
} from '@arch/contracts'

export interface MvcVariables
extends NamedVariables {

  name: string

  framework: string

  language: string

  useDocker?: boolean
}