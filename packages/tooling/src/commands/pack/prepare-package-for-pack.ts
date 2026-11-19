import {
  NodeAsyncFileSystemAdapter,
  NodePathService,
  NodeIdGenerator,
} from '@arch-platform/infrastructure';

interface PreparePackageForPackOptions {
  readonly workspaceRoot: string;
  readonly packageRoot: string;
}

type PackageJson = Record<string, unknown>;

function isRecord(value: unknown): value is PackageJson {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function preparePackageForPack(
  options: PreparePackageForPackOptions,
): Promise<string> {
  const { workspaceRoot, packageRoot } = options;

  const idGenerator = new NodeIdGenerator();
  const pathService = new NodePathService();
  const fsAdapter = new NodeAsyncFileSystemAdapter({ root: workspaceRoot });

  const packageRelativePath = pathService.relative(workspaceRoot, packageRoot);

  if (
    !packageRelativePath ||
    packageRelativePath === '..' ||
    packageRelativePath.startsWith('../') ||
    packageRelativePath.startsWith('..\\')
  ) {
    throw new Error('Package root must be inside the workspace root');
  }

  const stagingPath = pathService.join('.arch', 'tmp', 'pack', idGenerator.generate());

  try {
    await fsAdapter.copy(packageRelativePath, stagingPath);

    const manifestPath = pathService.join(packageRelativePath, 'package.json');
    const manifest = await fsAdapter.readJson<PackageJson>(manifestPath);

    const arch = isRecord(manifest.arch) ? manifest.arch : undefined;
    const pack = arch && isRecord(arch.pack) ? arch.pack : undefined;
    const bundledDependencies = pack?.bundledDependencies;

    if (
      bundledDependencies !== undefined &&
      (!Array.isArray(bundledDependencies) ||
        !bundledDependencies.every((dependency) => typeof dependency === 'string'))
    ) {
      throw new Error('Invalid arch.pack.bundledDependencies configuration');
    }

    if (manifest.dependencies !== undefined && !isRecord(manifest.dependencies)) {
      throw new Error('Invalid package dependencies configuration');
    }

    if (Array.isArray(bundledDependencies) && isRecord(manifest.dependencies)) {
      const dependencies = { ...manifest.dependencies };

      for (const dependency of bundledDependencies as string[]) {
        delete dependencies[dependency];
      }

      if (Object.keys(dependencies).length > 0) {
        manifest.dependencies = dependencies;
      } else {
        delete manifest.dependencies;
      }
    }

    await fsAdapter.writeJson(pathService.join(stagingPath, 'package.json'), manifest);

    return stagingPath;
  } catch (error) {
    await fsAdapter.remove(stagingPath).catch(() => undefined);
    throw error;
  }
}
