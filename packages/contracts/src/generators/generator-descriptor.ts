// packages\contracts\src\generators\generator-descriptor.ts
export interface GeneratorDescriptor {
  id: string;

  displayName: string;

  description?: string;

  version: string;

  languages: readonly string[];

  frameworks: readonly string[];

  tags?: readonly string[];

  category?: string;

  icon?: string;
}
