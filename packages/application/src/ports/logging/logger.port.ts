// packages\application\src\ports\logging\logger.port.ts
export interface LoggerPort {
    debug(
        message: string,
        meta?: Record<string, unknown>
    ): void;

    info(
        message: string,
        meta?: Record<string, unknown>
    ): void;

    warn(
        message: string,
        meta?: Record<string, unknown>
    ): void;

    error(
        message: string,
        meta?: Record<string, unknown>
    ): void;
}