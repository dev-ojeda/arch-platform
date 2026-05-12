// packages\language-registry\src\adapters\typescript.adapter.ts
import type {
    FolderLayout,
    LanguageAdapter
} from '@arch/contracts'

function pascalCase(value: string) {
    return value
        .split(/[-_ ]+/)
        .map(v =>
            v.charAt(0).toUpperCase() +
            v.slice(1).toLowerCase()
        )
        .join('')
}

export class TypeScriptAdapter
    implements LanguageAdapter {

    id = 'typescript'

    extension = '.ts'

    formatName(name: string) {
        return pascalCase(name)
    }

    controllerName(name: string) {
        return `${this.formatName(name)}Controller`
    }

    serviceName(name: string) {
        return `${this.formatName(name)}Service`
    }

    repositoryName(name: string) {
        return `${this.formatName(name)}Repository`
    }

    modelName(name: string) {
        return this.formatName(name)
    }

    folderLayout(): FolderLayout {
        return {
            controller: 'controllers',
            service: 'services',
            repository: 'repositories',
            model: 'models'
        }
    }
}