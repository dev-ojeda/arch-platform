// packages\core\src\logging\console-logger.ts
import type { LoggerPort } from '@arch/contracts/logging';

export class ConsoleLogger implements LoggerPort {
  info(message: string): void {
    console.log(message);
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
