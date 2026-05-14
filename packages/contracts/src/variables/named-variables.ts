// packages\contracts\src\variables\named-variables.ts
export type VariableValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | VariableObject
    | VariableValue[]

export interface VariableObject {
    [key: string]: VariableValue
}

export type NamedVariables =
    Record<
        string,
        VariableValue
    >