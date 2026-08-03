// packages/build-core/src/public/build-scope.ts

export type BuildScope =
  | { mode: 'workspace' }
  | { mode: 'package'; packageName: string }
  | { mode: 'affected' }
  | { mode: 'since'; ref: string };
