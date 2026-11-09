import { rimraf } from 'rimraf';
import { describe, expect, it, vi } from 'vitest';

import { removePaths, removePathsByRimraf } from '../../../src/filesystem/io/fs-async.js';

vi.mock('rimraf', () => ({
  rimraf: vi.fn(),
}));

describe('filesystem async removal helpers', () => {
  it('removes paths in parallel', async () => {
    vi.mocked(rimraf).mockResolvedValue(undefined);

    await removePathsByRimraf(['/one', '/two']);

    expect(rimraf).toHaveBeenCalledTimes(2);
    expect(rimraf).toHaveBeenCalledWith('/one', { preserveRoot: true, glob: false });
    expect(rimraf).toHaveBeenCalledWith('/two', { preserveRoot: true, glob: false });
  });

  it('propagates a removal failure through removePaths', async () => {
    const error = new Error('Removal failed');
    vi.mocked(rimraf).mockRejectedValueOnce(error);

    await expect(removePaths(['/one'])).rejects.toBe(error);
  });
});
