// packages/infrastructure/src/filesystem/adapters/base-filesystem-adapter.ts

import type { LoggerPort, PathService } from '@arch/contracts';

import { loggerFactory } from '../../logging/logger.js';
import { mapFileSystemError } from '../errors/map-filesystem-error.js';
import { normalizeSeparators } from '../paths/canonicalize-directory-entry.js';

export abstract class BaseFileSystemAdapter {
  protected readonly logger: LoggerPort;
  protected constructor(
    component: string,
    protected readonly root: string,
    protected readonly pathService: PathService,
  ) {
    this.logger = loggerFactory.createLogger({
      component,
    });
  }

  protected resolvePath(targetPath: string): string {
    const normalized = this.pathService.normalize(targetPath);

    if (this.isPhysicalPath(normalized)) {
      return normalized;
    }

    return this.pathService.join(this.root, normalized.replace(/^[/\\]+/, ''));
  }
  protected resolveParentDirectory(path: string): string {
    return this.pathService.dirname(this.resolvePath(path));
  }
  protected toVirtualPath(targetPath: string): string {
    const relative = this.pathService.relative(this.root, targetPath);

    if (relative.startsWith('..')) {
      throw new Error(`Path outside filesystem root: ${targetPath}`);
    }

    return `/${normalizeSeparators(relative)}`;
  }
  protected logAndThrow(error: unknown, operation: string): never {
    const mapped = mapFileSystemError(error, operation);

    this.logger.error(mapped.message, {
      metadata: {
        operation: mapped.operation,
        path: mapped.path,
        cause: mapped.cause,
      },
    });

    throw mapped;
  }
  private isPhysicalPath(targetPath: string): boolean {
    return /^[a-zA-Z]:[\\/]/.test(targetPath) || targetPath.startsWith('\\\\');
  }
}
