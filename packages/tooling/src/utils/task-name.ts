// packages/tooling/src/utils/task-name.ts

export const ToolingTaskNames = {
  build: 'tooling.build',
  clean: 'tooling.clean',
  dev: 'tooling.dev',
  lint: 'tooling.lint',
  test: 'tooling.test',
  typecheck: 'tooling.typecheck',
  validate: 'tooling.validate',
} as const;

export type ToolingTaskName = (typeof ToolingTaskNames)[keyof typeof ToolingTaskNames];
