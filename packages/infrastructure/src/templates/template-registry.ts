import type { PathService } from '@arch/contracts/runtime';

export class TemplateRegistry {
  constructor(
    private readonly pathService: PathService,
    private readonly root: string,
  ) {}

  resolve(pattern: string, template: string): string {
    return this.pathService.join(this.root, pattern, `${template}.hbs`);
  }
}
