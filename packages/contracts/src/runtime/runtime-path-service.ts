// packages/contracts/src/runtime/runtime-path-service.ts

export interface PathService {
  join(...segments: string[]): string;

  normalize(targetPath: string): string;

  relative(from: string, to: string): string;

  isAbsolute(targetPath: string): boolean;

  resolve(...segments: string[]): string;

  dirname(targetPath: string): string;

  basename(targetPath: string): string;
}
