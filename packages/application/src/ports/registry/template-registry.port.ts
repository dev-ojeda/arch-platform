import type {
    TemplateDefinition
} from '@arch/contracts';

export interface TemplateSearchQuery {
    language?: string;
    framework?: string;
    tags?: string[];
}

export interface TemplateRegistryPort {
    search(
        query?: TemplateSearchQuery
    ): Promise<TemplateDefinition[]>;

    findById(
        id: string
    ): Promise<TemplateDefinition | undefined>;
}