// generators/mvc/src/types.ts

import type { NamedVariables } from "@arch/contracts"

export interface MvcTemplateVariables {

    /*
     * User input
     */
    name: string

    /*
     * Derived variables
     */
    className: string

    controllerName: string

    serviceName: string

    repositoryName: string

    modelName: string

    extension: string

    folders: {
        controller: string
        service: string
        repository: string
        model: string
    }
}

export interface MvcInputVariables
    extends NamedVariables {}