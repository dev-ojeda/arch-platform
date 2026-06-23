import { SECRET_KEY_PATTERN } from './secret-pattern.js';

export function sanitizeEnv(env?: Record<string, string>): Record<string, string> | undefined {
  if (!env) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [key, SECRET_KEY_PATTERN.test(key) ? '***' : value]),
  );
}
