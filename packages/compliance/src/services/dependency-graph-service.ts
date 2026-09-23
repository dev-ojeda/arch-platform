// packages/compliance/src/services/dependency-graph-service.ts

import type { DependencyGraph, DependencyNode } from '@arch-platform/platform-model';

export class DependencyGraphService {
  constructor(private readonly graph: DependencyGraph) {}

  getNode(id: string): DependencyNode {
    const node = this.graph.nodes.get(id);

    if (!node) {
      throw new Error(`Missing dependency node ${id}`);
    }

    return node;
  }

  getDependencies(id: string): readonly string[] {
    return this.getNode(id).dependencies;
  }

  getDependents(id: string): readonly string[] {
    return this.getNode(id).dependents;
  }

  getDependencyClosure(id: string): Set<string> {
    const visited = new Set<string>();

    this.visitDependencies(id, visited);

    return visited;
  }

  private visitDependencies(id: string, visited: Set<string>): void {
    if (visited.has(id)) {
      return;
    }

    visited.add(id);

    for (const dependency of this.getDependencies(id)) {
      this.visitDependencies(dependency, visited);
    }
  }
}
