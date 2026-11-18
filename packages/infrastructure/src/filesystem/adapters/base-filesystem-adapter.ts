// packages/infrastructure/src/filesystem/adapters/base-filesystem-adapter.ts

import type { LoggerPort, PathService } from '@arch-platform/contracts';

import { loggerFactory } from '../../logging/logger.js';
import { isErrnoException } from '../errors/errno-utils.js';
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
    const canonical = normalizeSeparators(targetPath);
    const normalizedRoot = this.pathService.resolve(this.root);
    const canonicalRoot = normalizeSeparators(normalizedRoot);

    const usesWindowsPaths = this.pathService.isAbsolute('C:/');

    // 1. Detectar ruta física de Windows (ej. C:/... o //server/...)
    const isWindowsPhysical =
      usesWindowsPaths && (/^[a-zA-Z]:\//.test(canonical) || canonical.startsWith('//'));
    // 2. Detectar ruta física de Ubuntu/Linux (empieza con root o ya resuelta dentro de root)
    const isLinuxPhysical =
      canonical === canonicalRoot ||
      canonical.startsWith(`${canonicalRoot}/`) ||
      (canonical.startsWith('/') &&
        this.isWithinRoot(normalizedRoot, this.pathService.resolve(canonical)));

    let resolvedPath: string;

    if (isWindowsPhysical || isLinuxPhysical) {
      resolvedPath = this.pathService.resolve(canonical);
    } else {
      // Tratar como ruta virtual o relativa (quitando barras iniciales)
      const relativeVirtual = canonical.replace(/^\/+/, '');
      resolvedPath = this.pathService.resolve(normalizedRoot, relativeVirtual);
    }

    // 3. Garantizar que nunca escape de this.root (evita Path Traversal)
    if (!this.isWithinRoot(normalizedRoot, resolvedPath)) {
      throw new Error(`Path outside filesystem root: ${targetPath}`);
    }

    return resolvedPath;
  }

  protected toVirtualPath(targetPath: string): string {
    const normalizedRoot = this.pathService.resolve(this.root);
    const normalizedTarget = this.pathService.resolve(targetPath);

    if (!this.isWithinRoot(normalizedRoot, normalizedTarget)) {
      throw new Error(`Path outside filesystem root: ${targetPath}`);
    }

    const relative = this.pathService.relative(normalizedRoot, normalizedTarget);
    const virtual = normalizeSeparators(relative);

    return virtual === '' ? '/' : `/${virtual}`;
  }

  private isWithinRoot(rootPath: string, targetPath: string): boolean {
    const relative = this.pathService.relative(rootPath, targetPath);

    return (
      relative === '' ||
      (!relative.startsWith('../') &&
        !relative.startsWith('..\\') &&
        relative !== '..' &&
        !this.pathService.isAbsolute(relative))
    );
  }

  protected logAndThrow(error: unknown, operation: string): never {
    const sanitizedError = this.sanitizeErrorPath(error);
    const mapped = mapFileSystemError(sanitizedError, operation);

    this.logger.error(mapped.message, {
      metadata: {
        operation: mapped.operation,
        path: mapped.path,
        cause: error, // Conserva el error original con la ruta física real en el log
      },
    });

    throw mapped;
  }

  protected resolveTempPrefix(prefix = 'tmp-'): {
    resolvedPrefix: string;
    parentDirectory: string;
  } {
    const normalizedPrefix = normalizeSeparators(prefix);
    const isDirectoryTarget = normalizedPrefix === '' || normalizedPrefix.endsWith('/');

    const safePrefix = isDirectoryTarget ? `${normalizedPrefix}tmp-` : normalizedPrefix;
    const resolvedPrefix = this.resolvePath(safePrefix);
    const parentDirectory = this.pathService.dirname(resolvedPrefix);

    return { resolvedPrefix, parentDirectory };
  }

  private sanitizeErrorPath(error: unknown): unknown {
    if (!isErrnoException(error)) {
      return error;
    }

    if (!error.path) {
      return error;
    }

    let sanitizedPath: string;

    try {
      sanitizedPath = this.toVirtualPath(error.path);
    } catch {
      sanitizedPath = '<outside-root>';
    }

    return Object.assign(new Error(error.message), error, {
      path: sanitizedPath,
    });
  }
}
