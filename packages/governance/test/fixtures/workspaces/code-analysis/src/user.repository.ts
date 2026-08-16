// packages/governance/test/fixtures/workspaces/type-only-import/package-b/src/user.repository.ts

import type { UserService } from './user.service.js';

export interface UserRepository {
  findById(id: string): Promise<void>;
}

export type UserId = UserService;
