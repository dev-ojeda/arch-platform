// packages\core\src\logging\console-logger.ts
import type { LoggerOptions, LoggerPort } from '@arch/contracts';

export class ConsoleLogger implements LoggerPort {
  trace(): void {
    // no-op
  }
  success(message: string, options?: LoggerOptions): void {
    this.info(message, options);
  }
  info(message: string, options?: LoggerOptions): void {
    console.info(message, options);
  }

  warn(message: string): void {
    console.warn(message);
  }

  error(message: string): void {
    console.error(message);
  }

  debug(_message: string, _meta?: unknown): void {
    // TODO: implement structured debug logging
  }
}
