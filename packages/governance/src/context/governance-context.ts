// packages/governance/src/context/governance-context.ts

export interface GovernanceArchMetadata {
  layer?: string;

  type?: string;

  runtime?: 'node' | 'browser' | 'universal';
}

export interface GovernancePackageManifest {
  version?: string;

  private?: boolean;

  dependencies?: Record<string, string>;

  devDependencies?: Record<string, string>;

  peerDependencies?: Record<string, string>;

  arch?: GovernanceArchMetadata;
}

export interface GovernancePackage {
  name: string;

  rootPath: string;

  manifestPath: string;

  manifest: GovernancePackageManifest;
}

export interface GovernanceContext {
  workspaceRoot: string;

  packages: GovernancePackage[];
}
