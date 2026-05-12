// packages\core\src\variables\types.ts

export interface DerivedTemplateVariables {

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

export type ResolvedTemplateVariables<
    TVariables extends object
> =
    TVariables &
    DerivedTemplateVariables