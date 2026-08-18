// packages/governance/test/fixtures/workspaces/type-only-import/package-a/src/user.controller.ts

import { UserService } from '../../package-b/src/user.service.js';

export class UserController {
  constructor(private readonly service: UserService) {}
}
