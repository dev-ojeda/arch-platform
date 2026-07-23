// packages/build-core/src/graph/graph-query-services.ts

import type { DagNode, Graph } from '@arch/platform-model';

export class GraphQueryService {
  constructor(private readonly graph: Graph) {}

  getNode(name: string): DagNode {
    const node = this.graph.get(name);
    if (!node) throw new Error(`Missing node ${name}`);
    return node;
  }

  getDependencies(name: string): readonly string[] {
    return this.getNode(name).dependencies;
  }

  getDependents(name: string): readonly string[] {
    return this.getNode(name).dependents;
  }

  entries(): IterableIterator<[string, DagNode]> {
    return this.graph.entries();
  }

  getDependencyClosure(target: string): Set<string> {
    const visited = new Set<string>();

    this.visitDependencies(target, visited);

    return visited;
  }

  getImpactClosure(changed: Set<string>): Set<string> {
    const visited = new Set<string>();

    for (const n of changed) {
      this.visitDependents(n, visited);
    }

    return visited;
  }

  resolveExecutionScope(target: string, changed: Set<string>): Set<string> {
    const impacted = this.getImpactClosure(changed);
    const deps = this.getDependencyClosure(target);

    const scope = new Set<string>();

    for (const n of deps) {
      if (impacted.has(n)) scope.add(n);
    }

    scope.add(target);
    return scope;
  }

  private visitDependencies(name: string, visited: Set<string>): void {
    if (visited.has(name)) {
      return;
    }

    visited.add(name);

    for (const dep of this.getDependencies(name)) {
      this.visitDependencies(dep, visited);
    }
  }
  private visitDependents(name: string, visited: Set<string>) {
    if (visited.has(name)) return;

    visited.add(name);

    for (const dep of this.getDependents(name)) {
      this.visitDependents(dep, visited);
    }
  }
}
