// packages/build-core/src/graph/runtime-state.ts

export type RuntimeStatus = 'pending' | 'running' | 'done' | 'failed';

export class RuntimeState {
  private entries = new Map<string, RuntimeStatus>();

  reset(scope: Set<string>): void {
    this.entries.clear();

    for (const name of scope) {
      this.entries.set(name, 'pending');
    }
  }

  set(name: string, status: RuntimeStatus): void {
    this.entries.set(name, status);
  }

  get(name: string): RuntimeStatus | undefined {
    return this.entries.get(name);
  }

  isDone(name: string): boolean {
    return this.get(name) === 'done';
  }
}
