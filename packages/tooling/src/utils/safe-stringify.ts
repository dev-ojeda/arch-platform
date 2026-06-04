// packages/tooling/src/utils/safe-stringify.ts

function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

export function safeStringify(value: unknown, space?: number): string {
  const seen = new WeakSet<object>();

  try {
    return JSON.stringify(
      value,
      (_key, currentValue: unknown) => {
        if (isObject(currentValue)) {
          if (seen.has(currentValue)) {
            return '[Circular]';
          }

          seen.add(currentValue);
        }

        return currentValue;
      },
      space,
    );
  } catch {
    return '[unserializable]';
  }
}
