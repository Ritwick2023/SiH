#!/usr/bin/env bash
set -e

# =============================================================================
# StatVidya Sovereign MinIO Bucket Initialization Script
# Creates required sovereign storage buckets:
# 1. statvidya-manuals
# 2. statvidya-training-videos
# 3. statvidya-certificates
# =============================================================================

MINIO_ENDPOINT=${MINIO_ENDPOINT:-"http://localhost:9000"}
MINIO_ACCESS_KEY=${MINIO_ROOT_USER:-"statvidya_admin"}
MINIO_SECRET_KEY=${MINIO_ROOT_PASSWORD:-"statvidya_secure_minio_password_2026"}

echo "🚀 Configuring MinIO sovereign storage buckets at ${MINIO_ENDPOINT}..."

# If running within Docker environment or mc is available
if command -v mc &> /dev/null; then
    mc alias set statvidya-local "$MINIO_ENDPOINT" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY"
    mc mb --ignore-existing statvidya-local/statvidya-manuals
    mc mb --ignore-existing statvidya-local/statvidya-training-videos
    mc mb --ignore-existing statvidya-local/statvidya-certificates
    echo "✅ MinIO buckets created successfully via local mc client."
elif docker ps | grep -q "statvidya-minio"; then
    docker exec statvidya-minio mc alias set local http://localhost:9000 "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY"
    docker exec statvidya-minio mc mb --ignore-existing local/statvidya-manuals
    docker exec statvidya-minio mc mb --ignore-existing local/statvidya-training-videos
    docker exec statvidya-minio mc mb --ignore-existing local/statvidya-certificates
    echo "✅ MinIO buckets created successfully via docker container."
else
    echo "ℹ️ MinIO container is not running yet. Run 'docker compose up -d minio' first."
fi
