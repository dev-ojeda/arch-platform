// packages/tooling/src/commands/config/config-file-name.ts

export const FileConfigNames = {
  tsconfig: 'tsconfig.json',
  tsconfigBuild: 'tsconfig.build.json',

  tsupConfig: 'tsup.config.ts',

  vitestConfig: 'vitest.config.ts',

  eslintConfig: 'eslint.config.mjs',
} as const;

export type FileConfigName = (typeof FileConfigNames)[keyof typeof FileConfigNames];
