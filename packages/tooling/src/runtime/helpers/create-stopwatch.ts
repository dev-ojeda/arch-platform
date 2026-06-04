// packages/tooling/src/runtime/helpers/create-stopwatch.ts

export interface Stopwatch {
  elapsed(): number;

  elapsedSeconds(): number;

  restart(): void;
}

export function createStopwatch(): Stopwatch {
  let startedAt = performance.now();

  return {
    elapsed(): number {
      return Math.round(performance.now() - startedAt);
    },

    elapsedSeconds(): number {
      return Number(((performance.now() - startedAt) / 1000).toFixed(1));
    },

    restart(): void {
      startedAt = performance.now();
    },
  };
}
