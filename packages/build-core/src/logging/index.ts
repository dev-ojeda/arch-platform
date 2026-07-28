// packages/build-core/src/logging/index.ts

export { LOG_EVENTS } from './log-events.js';
export { LOG_LEVELS } from './log-levels.js';
export type { LogLevel, LogMetadata, LogOptions } from './log-types.js';
export { logger } from './logger.js';
export { sanitizeEnv } from './sanitize-env.js';
export { sanitizeMetadata } from './sanitize-metadata.js';
export { SECRET_KEY_PATTERN } from './secret-pattern.js';
export { TRACE_CACHE_ENABLED, TRACE_ENABLED, TRACE_HASH_ENABLED } from './trace-config.js';
export type { TraceCategory } from './trace-config.js';
