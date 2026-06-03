// packages/tooling/src/utils/sanitize-env.ts

const SECRET_ENV_PATTERN = /(token|secret|password|api[-_]?key)/i;

export function sanitizeEnv(env?: Record<string, string>): Record<string, string> | undefined {
  if (!env) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [key, SECRET_ENV_PATTERN.test(key) ? '***' : value]),
  );
}
