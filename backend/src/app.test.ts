import { describe, expect, it, vi } from 'vitest';

import { createApp } from './app.js';

describe('app', () => {
  it('returns Hello World', async () => {
    const app = createApp({
      $queryRaw: vi.fn(),
    });
    const response = await app.request('/');

    await expect(response.text()).resolves.toBe('Hello World');
    expect(response.status).toBe(200);
  });

  it('returns database health', async () => {
    const app = createApp({
      $queryRaw: vi.fn().mockResolvedValue([{ result: 1 }]),
    });
    const response = await app.request('/db/health');

    await expect(response.json()).resolves.toEqual({
      ok: true,
      result: 1,
    });
    expect(response.status).toBe(200);
  });
});
