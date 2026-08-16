// packages/platform-model/src/architecture/architecture-layout.ts

export interface ArchitectureLayout {
  readonly root: string;
  readonly config: string;
  readonly packages?: string;
  readonly apps?: string;
  readonly docs?: string;
  readonly scripts?: string;
}
