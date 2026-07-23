// packages/contracts/src/hashing/config-hash-service.ts

export interface ConfigHashService {
  hashConfig(root: string): string;
}
