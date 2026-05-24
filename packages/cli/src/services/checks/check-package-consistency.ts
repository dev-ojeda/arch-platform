// packages/cli/src/services/checks/check-package-consistency.ts
import fs from 'node:fs';
import path from 'node:path';

export async function checkPackageConsistency() {
  const packagesDir = path.resolve('packages');

  if (!fs.existsSync(packagesDir)) {
    return {
      name: 'package-consistency',
      success: false,
      message: 'packages directory missing',
      details: [],
    };
  }

  const packages = fs.readdirSync(packagesDir);

  const names = new Set<string>();
  const duplicates: string[] = [];

  for (const pkg of packages) {
    const packageJsonPath = path.join(packagesDir, pkg, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
      continue;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const name = packageJson.name;

    if (names.has(name)) {
      duplicates.push(name);
    }

    names.add(name);
  }

  return {
    name: 'package-consistency',
    success: duplicates.length === 0,
    message:
      duplicates.length === 0
        ? 'Package consistency validated'
        : 'Duplicate package names detected',
    details: duplicates,
  };
}
