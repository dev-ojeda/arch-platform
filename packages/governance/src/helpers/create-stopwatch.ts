// packages/governance/src/helpers/create-stopwatch.ts

export interface Stopwatch {
  milliseconds(): number;

  seconds(): number;

  restart(): void;
}

export function createStopwatch(): Stopwatch {
  let startedAt = performance.now();

  return {
    milliseconds(): number {
      return Math.round(performance.now() - startedAt);
    },

    seconds(): number {
      return Number(((performance.now() - startedAt) / 1000).toFixed(1));
    },

    restart(): void {
      startedAt = performance.now();
    },
  };
}
