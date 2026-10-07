// packages/compliance/src/dependency/dependency-graph-builder.ts

import type {
  ArchitectureManifest,
  DependencyGraph,
  DependencyLockfilePackageSpec,
  DependencyNode,
} from '@arch-platform/platform-model';

import { DependencyLockfileQuery } from './dependency-lock-file-query.js';

export class DependencyGraphBuilder {
  constructor(
    private readonly query: DependencyLockfileQuery,
    private readonly architecture: ArchitectureManifest,
  ) {}

  build(packageName: string): DependencyGraph {
    const nodes = new Map<string, DependencyNode>();

    const importerPath = this.resolveImporterPath(packageName);
    const importer = this.query.getImporter(importerPath);

    if (importer) {
      const dependencies = importer.dependencies ?? {};

      for (const [dependencyName, spec] of Object.entries(dependencies)) {
        this.visitDependency(dependencyName, spec, nodes);
      }

      return { nodes };
    }

    this.visitRegistryRoot(packageName, nodes);

    return {
      nodes,
    };
  }

  private visitDependency(
    packageName: string,
    spec: DependencyLockfilePackageSpec,
    nodes: Map<string, DependencyNode>,
  ): void {
    const version = this.resolveVersion(packageName, spec);
    const id = `${packageName}@${version}`;

    if (nodes.has(id)) {
      return;
    }

    if (this.isWorkspaceDependency(spec)) {
      this.visitWorkspaceDependency(packageName, version, nodes);
      return;
    }

    this.visitRegistryDependency(packageName, version, nodes);
  }
  private visitRegistryDependency(
    packageName: string,
    version: string,
    nodes: Map<string, DependencyNode>,
  ): void {
    const id = `${packageName}@${version}`;

    const pkg = this.query.getPackage(packageName, version);

    if (!pkg) {
      throw new Error(`Missing lockfile package ${id}`);
    }

    const snapshot = this.query.getSnapshot(packageName, version);

    if (!snapshot) {
      throw new Error(`Missing lockfile snapshot ${id}`);
    }

    const dependencies = Object.entries(snapshot.dependencies ?? {}).map(
      ([dependencyName, dependencyVersion]) => `${dependencyName}@${dependencyVersion}`,
    );

    nodes.set(id, {
      id,
      packageName,
      version,
      dependencies,
      dependents: [],
    });

    for (const dependency of dependencies) {
      const separator = dependency.lastIndexOf('@');
      const dependencyName = dependency.slice(0, separator);
      const dependencyVersion = dependency.slice(separator + 1);

      this.visitDependency(
        dependencyName,
        {
          version: dependencyVersion,
        },
        nodes,
      );
    }
  }
  private visitWorkspaceDependency(
    packageName: string,
    version: string,
    nodes: Map<string, DependencyNode>,
  ): void {
    const id = `${packageName}@${version}`;
    const importerPath = this.resolveImporterPath(packageName);
    const importer = this.query.getImporter(importerPath);

    if (!importer) {
      throw new Error(`Missing lockfile importer ${importerPath}`);
    }

    const dependencies = importer.dependencies ?? {};

    nodes.set(id, {
      id,
      packageName,
      version,
      dependencies: Object.entries(dependencies).map(
        ([dependencyName, spec]) =>
          `${dependencyName}@${this.resolveVersion(dependencyName, spec)}`,
      ),
      dependents: [],
    });

    for (const [dependencyName, spec] of Object.entries(dependencies)) {
      this.visitDependency(dependencyName, spec, nodes);
    }
  }
  private resolveVersion(packageName: string, spec: DependencyLockfilePackageSpec): string {
    if (spec.version) {
      return spec.version;
    }

    throw new Error(`Cannot resolve version for dependency ${packageName}`);
  }

  private resolveImporterPath(packageName: string): string {
    const pkg = this.architecture.packages.find((candidate) => candidate.name === packageName);

    if (!pkg) {
      throw new Error(`Missing architecture package ${packageName}`);
    }

    return pkg.path;
  }
  private isWorkspaceDependency(spec: DependencyLockfilePackageSpec): boolean {
    return spec.version?.startsWith('link:') === true;
  }
  private visitRegistryRoot(packageName: string, nodes: Map<string, DependencyNode>): void {
    const packages = this.query.getPackages(packageName);

    if (packages.size === 0) {
      throw new Error(`Missing lockfile package ${packageName}`);
    }

    if (packages.size > 1) {
      const versions = [...packages.keys()].join(', ');
      throw new Error(`Ambiguous lockfile package ${packageName}; found versions: ${versions}`);
    }

    const [version] = packages.keys();

    if (!version) {
      throw new Error(`Missing lockfile version for package ${packageName}`);
    }

    this.visitRegistryDependency(packageName, version, nodes);
  }
}
