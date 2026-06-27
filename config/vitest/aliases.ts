import { PLATFORM_PACKAGES, packageSource } from '../paths/index.js';

export const workspaceAliases = PLATFORM_PACKAGES.flatMap((pkg) => [
  {
    find: new RegExp(`^@arch/${pkg}$`),
    replacement: packageSource(pkg),
  },
  {
    find: new RegExp(`^@arch/${pkg}/(.*)$`),
    replacement: `${packageSource(pkg)}/$1`,
  },
]);
