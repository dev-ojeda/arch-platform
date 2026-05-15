// packages\contracts\src\variables\variable-value.ts
export type VariableValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | VariableObject
    | VariableArray

export interface VariableObject {

    readonly [key: string]:
        VariableValue
}

export type VariableArray =
    readonly VariableValue[]