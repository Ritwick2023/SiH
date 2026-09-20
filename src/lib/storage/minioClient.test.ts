import { describe, it, expect } from 'vitest';
import {
  generatePresignedUploadUrl,
  getDownloadUrl,
  deleteObject,
  listObjects,
} from './minioClient';

describe('MinIO Sovereign Storage Client', () => {
  it('generates presigned upload URL with fallback', async () => {
    const url = await generatePresignedUploadUrl(
      'statvidya-manuals',
      'test_manual.pdf',
      'application/pdf'
    );
    expect(url).toBeDefined();
    expect(typeof url).toBe('string');
    expect(url.length).toBeGreaterThan(10);
  });

  it('generates download URL with fallback', async () => {
    const url = await getDownloadUrl('statvidya-manuals', 'test_manual.pdf');
    expect(url).toBeDefined();
    expect(typeof url).toBe('string');
  });

  it('deletes object without throwing', async () => {
    await expect(deleteObject('statvidya-manuals', 'test_manual.pdf')).resolves.not.toThrow();
  });

  it('lists objects with fallback', async () => {
    const objects = await listObjects('statvidya-manuals');
    expect(objects).toBeDefined();
    expect(Array.isArray(objects)).toBe(true);
    expect(objects.length).toBeGreaterThanOrEqual(1);
  });
});
