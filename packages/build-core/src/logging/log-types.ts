// packages/build-core/src/logging/log-types.ts

// log-types.ts

export type LogMetadata = Readonly<Record<string, unknown>>;

export interface LogOptions {
  readonly prefix?: boolean;
  readonly metadata?: LogMetadata;
}

export type LogLevel = 'trace' | 'info' | 'success' | 'warn' | 'error';
