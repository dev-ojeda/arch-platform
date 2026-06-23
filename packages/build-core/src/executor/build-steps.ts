// packages/build-core/src/executor/build-steps.ts

export interface BuildStep {
  name: string;

  command: string;

  args: string[];
}
