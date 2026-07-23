// packages/governance/src/policies/default-dependency-matrix.ts

import type { DependencyMatrix } from '@arch/platform-model';

export const DEFAULT_MATRIX: DependencyMatrix = {
  domain: {
    domain: 'allow',
    infra: 'deny',
    app: 'allow',
    sdk: 'allow',
    tooling: 'allow',
  },
  app: {
    domain: 'allow',
    infra: 'allow',
    sdk: 'allow',
    tooling: 'allow',
  },
  infra: {
    domain: 'allow',
    infra: 'allow',
    sdk: 'allow',
    app: 'deny',
    tooling: 'allow',
  },
  sdk: {
    domain: 'allow',
    infra: 'allow',
    app: 'allow',
    tooling: 'allow',
  },
  tooling: {
    domain: 'allow',
    infra: 'allow',
    app: 'allow',
    sdk: 'allow',
    tooling: 'allow',
  },
};
