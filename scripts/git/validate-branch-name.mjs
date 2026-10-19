import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import logger from './logger.mjs';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '../..');
const policyPath = join(repositoryRoot, 'config/git-branch-policy.json');

async function main() {
  const branchName = process.argv[2];

  if (!branchName) {
    logger.error('[ERROR] Debes indicar el nombre de la rama.');
    process.exitCode = 1;
    return;
  }

  const policy = JSON.parse(await readFile(policyPath, 'utf8'));

  const separatorIndex = branchName.indexOf('/');
  const prefix = branchName.slice(0, separatorIndex);
  const name = branchName.slice(separatorIndex + 1);

  if (separatorIndex <= 0 || name.includes('/') || !policy.allowedPrefixes.includes(prefix)) {
    logger.error(`[ERROR] Nombre de rama no permitido: ${branchName}`);
    logger.info(
      `[INFO] Prefijos permitidos: ${policy.allowedPrefixes
        .map((value) => `${value}/`)
        .join(', ')}`,
    );
    process.exitCode = 1;
    return;
  }

  if (!new RegExp(policy.namePattern).test(name)) {
    logger.error(`[ERROR] Formato de nombre no permitido: ${name}`);
    logger.info('[INFO] Usa minúsculas, números y guiones entre palabras.');
    process.exitCode = 1;
    return;
  }

  logger.success(`[OK] Nombre de rama válido: ${branchName}`);
}

main().catch((error) => {
  logger.error('[ERROR] No se pudo cargar la política de ramas.');
  logger.error(error.message);
  process.exitCode = 1;
});
