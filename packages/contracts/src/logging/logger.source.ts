// packages/contracts/src/logging/logger.source.ts

export interface LoggerSource {
  readonly component: string;
  readonly operation?: string;
}
