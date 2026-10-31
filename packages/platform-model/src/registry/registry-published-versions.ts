// packages/platform-model/src/registry/registry-published-versions.ts

export interface RegistryPublishedVersion {
  name: string;
  version: string;
  prereleaseTag?: string;
  dist?: {
    integrity?: string;
    tarball?: string;
  };
}

export interface RegistryPublishedPackage {
  packageName: string;
  'dist-tags': Record<string, string>;
  versions: Record<string, RegistryPublishedVersion>;
}

export interface RegistryPublishedVersions {
  schemaVersion: 1;
  registry: string;
  synchronizedAt: string;
  package: RegistryPublishedPackage;
}

export interface RegistryPublishedVersionsByScope {
  schemaVersion: 1;
  registry: string;
  synchronizedAt: string;
  packages: RegistryPublishedPackage[];
}
