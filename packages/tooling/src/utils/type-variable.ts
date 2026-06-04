// packages/tooling/src/utils/type-variable.ts
export const LOG_LEVELS = {
  info: {
    write: console.log,
    symbol: '',
  },

  success: {
    write: console.log,
    symbol: '✔ ',
  },

  warn: {
    write: console.warn,
    symbol: '▲ ',
  },

  error: {
    write: console.error,
    symbol: '✖ ',
  },
} as const;

export type LogLevel = keyof typeof LOG_LEVELS;

export type LogLevelConfig = (typeof LOG_LEVELS)[LogLevel];
