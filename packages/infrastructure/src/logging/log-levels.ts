import type { LoggerLevel } from '@arch/contracts';

export const LOG_LEVELS: Record<
  LoggerLevel,
  {
    write: (...args: string[]) => void;
    symbol: string;
  }
> = {
  trace: {
    write: console.debug,
    symbol: '🔍 ',
  },
  debug: {
    write: console.debug,
    symbol: '· ',
  },
  info: {
    write: console.log,
    symbol: 'ℹ  - INFO ',
  },
  success: {
    write: console.log,
    symbol: '✔  - SUCCESS ',
  },
  warn: {
    write: console.warn,
    symbol: '⚠  - WARN ',
  },
  error: {
    write: console.error,
    symbol: '✖  - ERROR ',
  },
};
