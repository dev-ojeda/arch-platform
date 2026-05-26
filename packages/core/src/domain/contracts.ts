// packages/core/src/domain/contracts.ts

export interface Disposable {
  dispose(): Promise<void>;
}

export interface Initializable {
  initialize(): Promise<void>;
}
