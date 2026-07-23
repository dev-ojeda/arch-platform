// packages/platform-model/src/architecture/dependency-matrix.ts

import type { Layer } from './layer.js';

export type DependencyRule = 'allow' | 'deny';

export type DependencyMatrix = Record<Layer, Partial<Record<Layer, DependencyRule>>>;
