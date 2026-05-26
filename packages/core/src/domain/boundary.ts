// packages/core/src/domain/boundary.ts

export interface BoundaryRule {
  source: string;

  allowed: string[];

  forbidden?: string[];
}
