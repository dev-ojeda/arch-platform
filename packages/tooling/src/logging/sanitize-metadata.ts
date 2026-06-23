import type { LogMetadata } from './log-types.js';
import { sanitizeEnv } from './sanitize-env.js';
import { SECRET_KEY_PATTERN } from './secret-pattern.js';

export function sanitizeMetadata(metadata?: LogMetadata): LogMetadata | undefined {
  if (!metadata) {
    return undefined;
  }

  const entries: Array<[string, unknown]> = Object.entries(metadata).map(
    ([key, value]): [string, unknown] => {
      if (SECRET_KEY_PATTERN.test(key)) {
        return [key, '***'];
      }

      if (key === 'env' && value !== null && typeof value === 'object') {
        return [key, sanitizeEnv(value as Record<string, string>)];
      }

      return [key, value];
    },
  );

  return Object.fromEntries(entries);
}
