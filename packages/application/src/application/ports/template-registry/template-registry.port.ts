

import type {
    TemplateDefinition
} from '@arch/contracts';


export interface TemplateFile {
    path: string;
    content: string;
}
export interface ProjectTemplate {
    name: string;
    files: TemplateFile[];
}

export interface TemplateSearchQuery {
    language?: string;
    framework?: string;
    tags?: string[];
}

export interface TemplateRegistryPort {
    get(name: string): Promise<ProjectTemplate>;

    list(): Promise<ProjectTemplate[]>;
}


// export interface TemplateRegistryPort {
//     search(
//         query?: TemplateSearchQuery
//     ): Promise<TemplateDefinition[]>;

//     findById(
//         id: string
//     ): Promise<TemplateDefinition | undefined>;
// }