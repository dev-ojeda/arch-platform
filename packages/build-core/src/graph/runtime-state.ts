// packages/build-core/src/graph/runtime-state.ts

export type RuntimeStatus = 'pending' | 'running' | 'done' | 'failed' | 'blocked';

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

  get(name: string) {
    return this.entries.get(name);
  }

  isCompleted(name: string): boolean {
    const status = this.get(name);

    return status === 'done' || status === 'failed' || status === 'blocked';
  }

  isRunning(name: string): boolean {
    return this.get(name) === 'running';
  }

  isPending(name: string): boolean {
    return this.get(name) === 'pending';
  }
}
