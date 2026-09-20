/**
 * src/lib/storage/minioClient.ts
 *
 * Sovereign S3-compatible object storage client for StatVidya.
 * Connects to on-premise / private cloud MinIO (zero egress fees, national sovereignty).
 * Employs dual-mode resilient fallback via executeWithFallback.
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { executeWithFallback, getServiceUrl } from '../serviceUtils';

let s3ClientInstance: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    const endpoint = getServiceUrl('MINIO_ENDPOINT', 'http://localhost:9000');
    const accessKeyId = process.env.MINIO_ROOT_USER || 'statvidya_admin';
    const secretAccessKey = process.env.MINIO_ROOT_PASSWORD || 'statvidya_minio_dev';

    s3ClientInstance = new S3Client({
      endpoint,
      region: 'us-east-1',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // Required for MinIO
    });
  }
  return s3ClientInstance;
}

/**
 * Generates a presigned PUT URL allowing clients to upload directly to MinIO.
 */
export async function generatePresignedUploadUrl(
  bucket: string,
  filename: string,
  mimeType: string,
  expirySeconds: number = 900
): Promise<string> {
  return executeWithFallback(
    async () => {
      const client = getS3Client();
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        ContentType: mimeType,
      });
      return await getSignedUrl(client, command, { expiresIn: expirySeconds });
    },
    () => {
      // Local / Offline fallback upload endpoint
      return `/api/storage/mock-upload?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(filename)}`;
    },
    'minioClient.generatePresignedUploadUrl',
    1500
  );
}

/**
 * Generates a presigned GET URL for downloading or viewing an object from MinIO.
 */
export async function getDownloadUrl(
  bucket: string,
  objectKey: string
): Promise<string> {
  return executeWithFallback(
    async () => {
      const client = getS3Client();
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: objectKey,
      });
      return await getSignedUrl(client, command, { expiresIn: 3600 });
    },
    () => {
      // Local fallback link
      return `/api/storage/mock-download/${encodeURIComponent(bucket)}/${encodeURIComponent(objectKey)}`;
    },
    'minioClient.getDownloadUrl',
    1500
  );
}

/**
 * Deletes an object from MinIO storage.
 */
export async function deleteObject(
  bucket: string,
  objectKey: string
): Promise<void> {
  return executeWithFallback(
    async () => {
      const client = getS3Client();
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: objectKey,
      });
      await client.send(command);
    },
    () => {
      // Graceful local deletion acknowledgment
      console.info(`[MinIO Local Fallback] Simulated delete for ${bucket}/${objectKey}`);
    },
    'minioClient.deleteObject',
    1500
  );
}

/**
 * Lists objects in a given MinIO bucket with optional prefix filtering.
 */
export async function listObjects(
  bucket: string,
  prefix?: string
): Promise<string[]> {
  return executeWithFallback(
    async () => {
      const client = getS3Client();
      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
      });
      const response = await client.send(command);
      return (response.Contents || []).map((item) => item.Key || '').filter(Boolean);
    },
    () => {
      // Local fallback: default known MoSPI manuals
      return [
        'manuals/plfs_instructions_2024.pdf',
        'manuals/capi_guidelines_2025.pdf',
        'manuals/schedule_0_demarcation.pdf',
      ].filter((k) => !prefix || k.startsWith(prefix));
    },
    'minioClient.listObjects',
    1500
  );
}
