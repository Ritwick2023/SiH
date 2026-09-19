import { describe, it, expect, vi } from 'vitest';
import { executeWithFallback, getServiceUrl } from './serviceUtils';

describe('serviceUtils', () => {
  describe('executeWithFallback', () => {
    it('returns remote result when remote action succeeds within timeout', async () => {
      const remote = vi.fn().mockResolvedValue('remote data');
      const fallback = vi.fn().mockReturnValue('fallback data');

      const result = await executeWithFallback(remote, fallback, 'testService', 500);

      expect(result).toBe('remote data');
      expect(remote).toHaveBeenCalledTimes(1);
      expect(fallback).not.toHaveBeenCalled();
    });

    it('falls back when remote action fails with an error', async () => {
      const remote = vi.fn().mockRejectedValue(new Error('Connection refused'));
      const fallback = vi.fn().mockReturnValue('fallback data');

      const result = await executeWithFallback(remote, fallback, 'testService', 500);

      expect(result).toBe('fallback data');
      expect(fallback).toHaveBeenCalledTimes(1);
    });

    it('falls back when remote action times out', async () => {
      const remote = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve('slow'), 300)));
      const fallback = vi.fn().mockReturnValue('fallback data');

      const result = await executeWithFallback(remote, fallback, 'slowService', 50);

      expect(result).toBe('fallback data');
      expect(fallback).toHaveBeenCalledTimes(1);
    });

    it('supports asynchronous fallbacks', async () => {
      const remote = vi.fn().mockRejectedValue(new Error('500 Server Error'));
      const fallback = vi.fn().mockResolvedValue('async fallback data');

      const result = await executeWithFallback(remote, fallback, 'asyncService', 100);

      expect(result).toBe('async fallback data');
      expect(fallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('getServiceUrl', () => {
    it('returns fallback when env var is undefined', () => {
      const url = getServiceUrl('NON_EXISTENT_VAR_123', 'http://localhost:8000');
      expect(url).toBe('http://localhost:8000');
    });
  });
});
