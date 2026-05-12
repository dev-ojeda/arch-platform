// packages/core/src/prompts/prompt-engine.ts

import type {
    BooleanField,
    PromptField,
    PromptSchema,
    PromptValue,
    SelectField,
    StringField
} from '@arch/contracts'

export interface PromptAdapter {
    input(field: StringField): Promise<string | undefined>

    select(
        field: SelectField
    ): Promise<string | undefined>

    boolean(
        field: BooleanField
    ): Promise<boolean | undefined>
}

export interface PromptEngineContext {
    signal?: AbortSignal
}

export class PromptEngine {
    constructor(
        private readonly adapter: PromptAdapter
    ) { }

    async collect(
        schema: PromptSchema,
        ctx?: PromptEngineContext
    ): Promise<PromptValue> {
        const result: PromptValue = {}

        for (const field of schema.fields) {
            if (ctx?.signal?.aborted) {
                throw new Error('Prompt collection cancelled')
            }

            if (!(await this.shouldAsk(field, result))) {
                continue
            }

            const value = await this.resolveField(
                field,
                result
            )

            result[field.name] = value
        }

        return result as PromptValue
    }

    private async resolveField(
        field: PromptField,
        values: Record<string, unknown>
    ): Promise<unknown> {
        switch (field.type) {
            case 'string':
                return this.resolveString(field)

            case 'select':
                return this.resolveSelect(field)

            case 'boolean':
                return this.resolveBoolean(field)

            default:
                throw new Error(
                    `Unsupported field type: ${(field as PromptField).type
                    }`
                )
        }
    }

    private async resolveString(
        field: StringField
    ): Promise<string> {
        const input =
            await this.adapter.input(field)
        ''

        let value =
            input?.trim()
                ? input
                : field.defaultValue?.toString()
                ?? ''

        this.validateRequired(field, value)

        return value
    }

    private async resolveSelect(
        field: SelectField
    ): Promise<string> {
        const value =
            (await this.adapter.select(field)) ??
            field.defaultValue?.toString() ??
            ''

        this.validateRequired(field, value)

        return value
    }

    private async resolveBoolean(
        field: BooleanField
    ): Promise<boolean> {
        return (
            (await this.adapter.boolean(field)) ??
            Boolean(field.defaultValue)
        )
    }

    private validateRequired(
        field: PromptField,
        value: unknown
    ): void {
        if (
            field.required &&
            (
                value === undefined ||
                value === null ||
                value === ''
            )
        ) {
            throw new Error(
                `Field "${field.name}" is required`
            )
        }
    }

    private async applyTransform(
        field: PromptField,
        value: PromptValue
    ): Promise<PromptValue> {
        if (!field.transform) {
            return value
        }

        return await field.transform(value as never)
    }

    private async shouldAsk(
        field: PromptField,
        values: PromptValue
    ): Promise<boolean> {
        if (!field.when) {
            return true
        }

        return await field.when(values as never)
    }
}