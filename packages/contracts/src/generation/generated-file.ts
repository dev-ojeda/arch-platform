// packages/contracts/src/generation/generated-file.ts

export interface GeneratedFile {
  /*
   * Relative output path
   */

  readonly path: string;

  /*
   * Final rendered content
   */

  readonly content: string;

  /*
   * Indicates overwrite behavior
   */

  readonly overwrite?: boolean;
}
