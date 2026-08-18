// packages/governance/test/fixtures/workspaces/type-only-import/package-b/src/user.repository.ts

import type { User } from './types.js';

export interface UserRepository {
  findById(id: string): Promise<void>;
}

export type UserId = User;
