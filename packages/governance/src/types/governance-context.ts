import type { PackageDependencyGraph, SymbolGraph } from '@arch/code-analysis';

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

export interface PackageManifest {
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
}

export interface ResolvedPackage {
  name: string;

  rootPath: string;

  manifestPath: string;

  manifest: PackageManifest;

  boundaries?: GovernanceBoundaries;

  internalDependencies: readonly string[];
}

export interface GovernanceContext {
  readonly workspaceRoot: string;

  readonly packages: readonly ResolvedPackage[];
}

export interface GovernanceAnalysisContext {
  readonly symbolGraph: SymbolGraph;

  readonly packageGraph: PackageDependencyGraph;
}

export interface GovernanceExecutionContext extends GovernanceContext {
  readonly analysis: GovernanceAnalysisContext;
}
