// packages/tooling/src/commands/lint/request.ts

export interface LintRequest {
  readonly workspaceRoot: string;
  readonly packageName?: string;
  readonly fix?: boolean;
  readonly debug?: boolean;
}
