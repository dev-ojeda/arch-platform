// packages/governance/test/fixtures/workspaces/type-only-import/package-a/src/user.controller.ts

import type { UserService } from '@fixture/package-b';

export class UserController {
  constructor(private readonly service: UserService) {}
}
