// packages\application\src\ports\configuration\configuration.port.ts
export interface ConfigurationPort {
  get<T>(key: string): T | undefined;
}
