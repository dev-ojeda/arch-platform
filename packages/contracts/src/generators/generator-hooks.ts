// packages/contracts/src/generators/generator-hooks.ts


export interface FileHookContext<
    TVariables extends object
> {
    outputPath: string

    content: string

    variables: TVariables
}