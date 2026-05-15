// apps/vscode-extension/src/adapters/vscode-prompt-adapter.ts

import * as vscode from 'vscode'

import type {
    BooleanField,
    SelectField,
    SelectOption,
    StringField
} from '@arch/contracts'

import type {
    PromptAdapter
} from '@arch/application'

export class VSCodePromptAdapter
implements PromptAdapter {

    async input(
        field: StringField
    ): Promise<string | undefined> {

        console.log(
            '[arch] prompt input:',
            field.name
        )

        return await vscode.window.showInputBox({

            prompt:
                field.message,

            placeHolder:
                field.description,

            value:
                field.defaultValue
                    ?.toString(),

            ignoreFocusOut:
                true
        })
    }

    async select(
        field: SelectField,

        options: SelectOption[]
    ): Promise<string | undefined> {

        console.log(
            '[arch] prompt select:',
            field.name
        )

        const selected =
            await vscode.window.showQuickPick(

                options.map(option => ({

                    label:
                        option.label,

                    description:
                        option.value,

                    value:
                        option.value
                })),

                {

                    title:
                        field.message,

                    ignoreFocusOut:
                        true
                }
            )

        return selected?.value
    }

    async boolean(
        field: BooleanField
    ): Promise<boolean | undefined> {

        console.log(
            '[arch] prompt boolean:',
            field.name
        )

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

                    title:
                        field.message,

                    ignoreFocusOut:
                        true
                }
            )

        return selected?.value
    }
}