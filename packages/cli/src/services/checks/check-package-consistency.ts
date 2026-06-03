// packages/cli/src/services/checks/check-package-consistency.ts

import fs from 'node:fs';
import path from 'node:path';

import type { DoctorCheck } from './doctor-check.js';

interface PackageJson {
  name?: string;
}

export const checkPackageConsistency: DoctorCheck = {
  name: 'package-consistency',

  async run() {
    const packagesDir = path.resolve('packages');

    if (!fs.existsSync(packagesDir)) {
      return {
        severity: 'error',

        message: 'packages directory missing',

        details: ['Expected workspace directory: ./packages'],
      };
    }

    const packageDirectories = fs.readdirSync(packagesDir);

    const names = new Set<string>();

    const duplicates: string[] = [];

    for (const packageDirectory of packageDirectories) {
      const packageJsonPath = path.join(packagesDir, packageDirectory, 'package.json');

      if (!fs.existsSync(packageJsonPath)) {
        continue;
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as PackageJson;

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
