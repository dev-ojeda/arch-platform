// packages/build-core/src/package/package-config.ts

export type PackageBuildConfig = {
  mode?: 'tsc' | 'tsup' | 'custom' | 'script';
  command?: string;
  args?: string[];
};
