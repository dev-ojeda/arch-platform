// packages/build-core/src/workspace/package-json.ts

export type PackageJson = {
  name: string;

  version?: string;

  type?: string;

  main?: string;
  module?: string;
  types?: string;

  exports?: Record<
    string,
    {
      types?: string;
      import?: string;
      require?: string;
    }
  >;

  files?: string[];

  dependencies?: Record<string, string>;

  outputs?: string[];
};
export function isPackageJson(value: unknown): value is PackageJson {
  return (
    typeof value === 'object' && value !== null && 'name' in value && typeof value.name === 'string'
  );
}
