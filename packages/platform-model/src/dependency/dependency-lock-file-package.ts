// packages/platform-model/src/dependency/dependency-lock-file-package.ts

export interface DependencyLockfilePackage {
  readonly resolution?: {
    readonly integrity?: string;
  };

  readonly engines?: Readonly<Record<string, string>>;

  readonly dependencies?: Readonly<Record<string, string>>;
  readonly optionalDependencies?: Readonly<Record<string, string>>;

  readonly peerDependencies?: Readonly<Record<string, string>>;

  readonly peerDependenciesMeta?: Readonly<
    Record<
      string,
      {
        readonly optional?: boolean;
      }
    >
  >;

  readonly cpu?: readonly string[];
  readonly os?: readonly string[];
  readonly libc?: readonly string[];

  readonly hasBin?: boolean;
}
