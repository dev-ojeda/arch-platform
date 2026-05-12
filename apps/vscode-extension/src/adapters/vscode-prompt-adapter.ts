// apps/vscode-extension/src/adapters/vscode-prompt-adapter.ts

import * as vscode from 'vscode'

import type {
    PromptAdapter
} from '@arch/core'

import type {
    BooleanField,
    SelectField,
    StringField
} from '@arch/contracts'

export class VSCodePromptAdapter
implements PromptAdapter {

    async input(
        field: StringField
    ): Promise<string | undefined> {

        return vscode.window.showInputBox({

            title: field.message,

            prompt: field.description,

            value:
                field.defaultValue
        })
    }

    async select(
        field: SelectField
    ): Promise<string | undefined> {

        const options =
            typeof field.options === 'function'
                ? await field.options()
                : field.options

        const selected =
            await vscode.window.showQuickPick(

                options.map(option => ({

                    label: option.label,

                    value: option.value
                })),

                {
                    title: field.message
                }
            )

        return selected?.value
    }

    async boolean(
        field: BooleanField
    ): Promise<boolean | undefined> {

        const selected =
            await vscode.window.showQuickPick(

                [
                    {
                        label: 'Yes',

                        value: true
                    },

                    {
                        label: 'No',

                        value: false
                    }
                ],

                {
                    title: field.message
                }
            )

        return selected?.value
    }
}