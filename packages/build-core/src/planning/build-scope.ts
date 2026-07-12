// packages/build-core/src/planning/build-scope.ts

export type BuildScope =
  | {
      type: 'workspace';
    }
  | {
      type: 'package';
      packageName: string;
    };
