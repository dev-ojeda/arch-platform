// packages/governance/test/fixtures/workspaces/type-only-import/package-a/src/user.controller.ts

import { type OrderStatus } from './model/index.js';
import { type UserService } from './user.service.js';

export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly order: OrderStatus,
  ) {}
}
