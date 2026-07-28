// packages/build-core/src/logging/log-types.ts

import type { TraceCategory } from './trace-config.js';

export type LogMetadata = Readonly<Record<string, unknown>>;

export interface LogOptions {
  prefix?: boolean;
  metadata?: LogMetadata;
  category?: TraceCategory;
}
export type LogLevel = 'trace' | 'info' | 'success' | 'warn' | 'error';
