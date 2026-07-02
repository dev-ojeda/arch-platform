// packages/build-core/src/planning/build-plan.ts

import type { BuildPlanEntry } from './plan-entry.js';

export class BuildPlan {
  private readonly store = new Map<string, BuildPlanEntry>();

  set(name: string, entry: BuildPlanEntry): void {
    this.store.set(name, entry);
  }

  get(name: string): BuildPlanEntry | undefined {
    return this.store.get(name);
  }

  has(name: string): boolean {
    return this.store.has(name);
  }

  values(): ReadonlyArray<BuildPlanEntry> {
    return Array.from(this.store.values());
  }

  entries(): ReadonlyArray<[string, BuildPlanEntry]> {
    return Array.from(this.store.entries());
  }

  [Symbol.iterator](): IterableIterator<[string, BuildPlanEntry]> {
    return this.store[Symbol.iterator]();
  }
}
