// packages/build-core/src/workspace/package-json.ts

export type PackageBuildConfig = {
  mode?: 'tsc' | 'tsup' | 'custom' | 'script';
  command?: string;
  args?: string[];
};

export type PackageJson = {
  name: string;

  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;

  arch?: {
    build?: PackageBuildConfig;
  };

  main?: string;
  types?: string;
  outputs?: string[];
};
export function isPackageJson(value: unknown): value is PackageJson {
  return (
    typeof value === 'object' && value !== null && 'name' in value && typeof value.name === 'string'
  );
}
