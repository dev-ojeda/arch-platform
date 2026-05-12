// packages\application\src\ports\notification\notification.port.ts
export interface NotificationPort {
    info(message: string): Promise<void>;

    warn(message: string): Promise<void>;

    error(message: string): Promise<void>;
}