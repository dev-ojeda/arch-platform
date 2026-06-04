// packages/contracts/src/generators/generator.metadata.ts

export interface GeneratorMetadata {
  readonly tags?: readonly string[];

  readonly category?: string;

  readonly owner?: string;

  readonly visibility?: 'public' | 'internal';

  readonly experimental?: boolean;
}
