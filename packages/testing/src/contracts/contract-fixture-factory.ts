// packages/testing/src/contracts/contract-fixture-factory.ts

import type { MaybePromise } from '@arch-platform/platform-model';

export type ContractFixtureFactory<T> = () => MaybePromise<T>;
