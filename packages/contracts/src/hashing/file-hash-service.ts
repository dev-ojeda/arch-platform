// packages/contracts/src/hashing/file-hash-service.ts

export interface FileHashService {
  hashFile(path: string): string;
}
