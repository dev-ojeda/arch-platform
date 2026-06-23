// packages/governance/src/types/dependency-layer.ts

export type Layer = 'domain' | 'infra' | 'app' | 'sdk' | 'tooling';

export type DependencyMatrix = Record<Layer, Partial<Record<Layer, 'allow' | 'deny'>>>;
