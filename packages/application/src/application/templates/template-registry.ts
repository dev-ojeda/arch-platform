// packages\core\templates\template-registry.ts
import * as path from 'node:path'

export class TemplateRegistry {
    constructor(
        private readonly root: string
    ) {}

    resolve(pattern: string, template: string): string {
        return path.join(
            this.root,
            pattern,
            `${template}.hbs`
        )
    }
}