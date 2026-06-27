// packages/cli/src/services/checks/check-package-consistency.ts

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import type { DoctorCheck } from './doctor-check.js';

interface PackageJson {
  name?: string;
}

export const checkPackageConsistency: DoctorCheck = {
  name: 'package-consistency',

  async run() {
    const packagesDir = resolve('packages');

    if (!existsSync(packagesDir)) {
      return {
        severity: 'error',

        message: 'packages directory missing',

        details: ['Expected workspace directory: ./packages'],
      };
    }

    const packageDirectories = readdirSync(packagesDir);

    const names = new Set<string>();

    const duplicates: string[] = [];

    for (const packageDirectory of packageDirectories) {
      const packageJsonPath = join(packagesDir, packageDirectory, 'package.json');

      if (!existsSync(packageJsonPath)) {
        continue;
      }

      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PackageJson;

      const packageName = packageJson.name;

      if (!packageName) {
        continue;
      }

      if (names.has(packageName)) {
        duplicates.push(packageName);
        continue;
      }

      names.add(packageName);
    }

    if (duplicates.length > 0) {
      return {
        severity: 'error',

        message: 'Duplicate package names detected',

        details: duplicates,
      };
    }

    return Promise.resolve({
      severity: 'info',
      message: 'Package consistency validated',
    });
  },
};
