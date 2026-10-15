// packages/platform-model/src/process/execution-process.ts

export interface ExecutionProcess {
  execute(
    filePath: string,
    args: readonly string[],
  ): Promise<{
    readonly stdout: string;
    readonly stderr: string;
  }>;

  executeInteractive(filePath: string, args: readonly string[]): Promise<void>;
}
