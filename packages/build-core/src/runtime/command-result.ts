// packages/build-core/src/runtime/command-result.ts

export interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}
