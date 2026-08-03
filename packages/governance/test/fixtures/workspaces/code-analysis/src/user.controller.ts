// packages/governance/test/fixtures/workspaces/code-analysis/src/user.controller.ts

import type { UserService } from './user.service.js';

export class UserController {
  constructor(private readonly service: UserService) {}

  get(id: string) {
    return this.service.findUser(id);
  }
}
