// packages/infrastructure/src/serialization/safe-stringify.ts

export function safeStringify(value: unknown, space?: number): string {
  const seen = new WeakSet<object>();

  const replacer = (_key: string, currentValue: unknown): unknown => {
    if (currentValue instanceof Error) {
      return {
        name: currentValue.name,
        message: currentValue.message,
        stack: currentValue.stack,
      };
    }

    if (typeof currentValue === 'bigint') {
      return currentValue.toString();
    }

    if (typeof currentValue === 'undefined') {
      return '[undefined]';
    }

    if (typeof currentValue === 'symbol') {
      return currentValue.toString();
    }

    if (currentValue instanceof Map) {
      return Object.fromEntries(currentValue);
    }

    if (currentValue instanceof Set) {
      return [...currentValue];
    }

    if (typeof currentValue === 'object' && currentValue !== null) {
      if (seen.has(currentValue)) {
        return '[Circular]';
      }

      seen.add(currentValue);
    }

    return currentValue;
  };

  try {
    return JSON.stringify(value, replacer, space);
  } catch {
    return '[unserializable]';
  }
}

export function safeParse<T>(content: string): T {
  return JSON.parse(content) as T;
}
