// packages\contracts\src\generator-schema.ts
export type GeneratorField =
  | {
      type: 'string';

      name: string;

      label: string;

      required?: boolean;

      defaultValue?: string;

      validate?: RegExp;
    }
  | {
      type: 'select';

      name: string;

      label: string;

      options: readonly string[];

      required?: boolean;

      defaultValue?: string;
    };
