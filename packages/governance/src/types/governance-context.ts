// packages/governance/src/types/governance-context.ts

export interface GovernanceArchMetadata {
  layer?: string;

  kind?: 'domain' | 'infra' | 'app' | 'sdk' | 'tooling';

  runtime?: 'node' | 'browser' | 'universal';

  tags?: string[];
}

export interface GovernanceBoundaries {
  public?: string[];

  private?: string[];

  forbiddenDependencies?: string[];
}

export interface GovernancePackageManifest {
  name?: string;

  version?: string;

  private?: boolean;

  type?: string;

  sideEffects?: boolean;

  exports?: Record<string, unknown>;

  dependencies?: Record<string, string>;

  devDependencies?: Record<string, string>;

  peerDependencies?: Record<string, string>;

  arch?: GovernanceArchMetadata;
}

export interface GovernancePackage {
  name: string;

  rootPath: string;

  manifestPath: string;

  packageJson: GovernancePackageManifest;

  boundaries?: GovernanceBoundaries;

  internalDependencies?: string[];
}

export type PackageManifest = {
  name: string;
  version?: string;
  private?: boolean;
  type?: string;
  sideEffects?: boolean;
  exports?: Record<string, unknown>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  arch?: GovernanceArchMetadata;
};
export type ResolvedPackage = {
  name: string;
  rootPath: string;
  manifestPath: string;
  manifest: PackageManifest;
  boundaries?: GovernanceBoundaries;
  internalDependencies: readonly string[];
};

export interface GovernanceContext {
  workspaceRoot: string;
  packages: ResolvedPackage[];
}
