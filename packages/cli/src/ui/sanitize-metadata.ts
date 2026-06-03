// packages/cli/src/ui/sanitize-metadata.ts

import { sanitizeEnv } from './sanitize-env.js';

export type LogMetadata = Record<string, unknown>;

const SECRET_KEY_PATTERN = /(token|secret|password|api[-_]?key)/i;

export function sanitizeMetadata(metadata?: LogMetadata): LogMetadata | undefined {
  if (!metadata) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      if (SECRET_KEY_PATTERN.test(key)) {
        return [key, '***'];
      }

      if (key === 'env' && value && typeof value === 'object') {
        return [key, sanitizeEnv(value as Record<string, string>)];
      }

      return [key, value];
    }),
  );
}
