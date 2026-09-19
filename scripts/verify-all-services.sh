#!/usr/bin/env bash
# scripts/verify-all-services.sh — StatVidya Service Healthcheck

set -e

echo "🔍 Checking StatVidya Architecture Health..."

# 1. Next.js Web App
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|307"; then
  echo "✅ Next.js Frontend: RUNNING (http://localhost:3000)"
else
  echo "⚠️  Next.js Frontend: NOT DETECTED (Run 'npm run dev')"
fi

# 2. FastAPI Analytics Microservice
if curl -s http://localhost:8000/health 2>/dev/null | grep -qE "healthy|ok"; then
  echo "✅ FastAPI Analytics Engine: HEALTHY (http://localhost:8000)"
else
  echo "⚠️  FastAPI Analytics Engine: OFFLINE (Run 'cd services/analytics-engine && uvicorn main:app --port 8000')"
fi

# 3. PostgreSQL with pgvector
if docker ps -q -f name=postgres 2>/dev/null | grep -q .; then
  if docker exec -it $(docker ps -q -f name=postgres) pg_isready -U statvidya_user &>/dev/null; then
    echo "✅ PostgreSQL + pgvector: CONNECTED (:5432)"
  else
    echo "⚠️  PostgreSQL: CONTAINER RUNNING BUT NOT READY (:5432)"
  fi
else
  echo "⚠️  PostgreSQL: CONTAINER NOT RUNNING (Run 'docker compose up -d postgres')"
fi

# 4. Redis Task Broker
if docker ps -q -f name=redis 2>/dev/null | grep -q .; then
  if docker exec -it $(docker ps -q -f name=redis) redis-cli ping &>/dev/null; then
    echo "✅ Redis Broker: PONG (:6379)"
  else
    echo "⚠️  Redis: CONTAINER RUNNING BUT NOT RESPONDING (:6379)"
  fi
else
  echo "⚠️  Redis: CONTAINER NOT RUNNING (Run 'docker compose up -d redis')"
fi

# 5. MinIO S3 Storage
if curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/minio/health/live 2>/dev/null | grep -q "200"; then
  echo "✅ MinIO Object Storage: HEALTHY (:9000)"
else
  echo "⚠️  MinIO: CONTAINER NOT RUNNING (Run 'docker compose up -d minio')"
fi

# 6. Elasticsearch
if curl -s http://localhost:9200 2>/dev/null | grep -q "tagline"; then
  echo "✅ Elasticsearch 8.x: READY (:9200)"
else
  echo "⚠️  Elasticsearch: CONTAINER NOT RUNNING (Run 'docker compose up -d elasticsearch')"
fi

echo "🏁 Verification Pass Complete."
