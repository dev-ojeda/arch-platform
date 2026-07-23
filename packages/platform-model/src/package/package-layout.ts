// packages/platform-model/src/package/package-layout.ts

export interface PackageLayout {
  readonly sourceDirectory: string;
  readonly hasSourceDirectory: boolean;

  readonly testsDirectory: string;
  readonly hasTestsDirectory: boolean;

  readonly distributionDirectory: string;
  readonly hasDistributionDirectory: boolean;
}
