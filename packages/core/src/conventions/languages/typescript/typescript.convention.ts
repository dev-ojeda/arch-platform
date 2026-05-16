// packages\core\src\languages\conventions\typescript.convention.ts
import type {
    FolderLayout,
    LanguageConvention
} from '@arch/contracts'

function pascalCase(
    value: string
): string {

    return value
        .split(/[-_ ]+/)
        .map(v =>
            v.charAt(0).toUpperCase() +
            v.slice(1).toLowerCase()
        )
        .join('')
}

export class TypeScriptConvention
implements LanguageConvention {

    readonly id =
        'typescript'

    readonly fileExtension =
        '.ts'

    readonly folderLayout:
        FolderLayout = {

        controller:
            'controllers',

        service:
            'services',

        repository:
            'repositories',

        model:
            'models'
    }

    formatName(
        name: string
    ): string {

        return pascalCase(name)
    }

    controllerName(
        name: string
    ): string {

        return `${this.formatName(name)}Controller`
    }

    serviceName(
        name: string
    ): string {

        return `${this.formatName(name)}Service`
    }

    repositoryName(
        name: string
    ): string {

        return `${this.formatName(name)}Repository`
    }

    modelName(
        name: string
    ): string {

        return this.formatName(name)
    }
}