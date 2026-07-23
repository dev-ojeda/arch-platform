// packages/contracts/src/hashing/directory-hash-service.ts

export interface DirectoryHashService {
  hashDirectory(path: string): string;
}
