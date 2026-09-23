import { describe, expect, it } from 'vitest';

import { getSecurityConfig } from '@arch-platform/infrastructure';

describe('getSecurityConfig', () => {
  it('uses the advisory path from the environment', () => {
    const previous = process.env.ARCH_SECURITY_ADVISORY_PATH;

    process.env.ARCH_SECURITY_ADVISORY_PATH = './custom/cve';

    try {
      expect(getSecurityConfig()).toEqual({
        advisoryPath: './custom/cve',
        lockfilePath: 'pnpm-lock.yaml',
      });
    } finally {
      if (previous === undefined) {
        delete process.env.ARCH_SECURITY_ADVISORY_PATH;
      } else {
        process.env.ARCH_SECURITY_ADVISORY_PATH = previous;
      }
    }
  });
  it('uses the provided lockfile path', () => {
    const previous = process.env.ARCH_SECURITY_ADVISORY_PATH;

    delete process.env.ARCH_SECURITY_ADVISORY_PATH;

    try {
      expect(getSecurityConfig('./data/security/pnpm-lock-test.yaml')).toEqual({
        advisoryPath: './data/security/cve',
        lockfilePath: './data/security/pnpm-lock-test.yaml',
      });
    } finally {
      if (previous === undefined) {
        delete process.env.ARCH_SECURITY_ADVISORY_PATH;
      } else {
        process.env.ARCH_SECURITY_ADVISORY_PATH = previous;
      }
    }
  });
  it('uses the default advisory path when the environment variable is not defined', () => {
    const previous = process.env.ARCH_SECURITY_ADVISORY_PATH;

    delete process.env.ARCH_SECURITY_ADVISORY_PATH;

    try {
      expect(getSecurityConfig()).toEqual({
        advisoryPath: './data/security/cve',
        lockfilePath: 'pnpm-lock.yaml',
      });
    } finally {
      if (previous === undefined) {
        delete process.env.ARCH_SECURITY_ADVISORY_PATH;
      } else {
        process.env.ARCH_SECURITY_ADVISORY_PATH = previous;
      }
    }
  });
});
