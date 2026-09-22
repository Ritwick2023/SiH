import os
import secrets
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "StatVidya Analytics Engine"
    APP_ENV: str = os.getenv("APP_ENV", os.getenv("NEXT_PUBLIC_APP_ENV", "development"))
    ANALYTICS_API_SECRET: str = os.getenv("ANALYTICS_API_SECRET", "statvidya_local_dev_secret_key_2026")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,https://statvidya.gov.in")
    
    # Databases & Queues
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://statvidya_user:statvidya_secure_pg_pass_2026@localhost:5432/statvidya_db" if os.getenv("APP_ENV") != "production" else "")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")
    
    # Storage & Search
    MINIO_ENDPOINT: str = os.getenv("MINIO_ENDPOINT", "localhost:9000")
    MINIO_ROOT_USER: str = os.getenv("MINIO_ROOT_USER", "statvidya_admin" if os.getenv("APP_ENV") != "production" else "")
    MINIO_ROOT_PASSWORD: str = os.getenv("MINIO_ROOT_PASSWORD", "statvidya_secure_minio_password_2026" if os.getenv("APP_ENV") != "production" else "")
    ELASTICSEARCH_URL: str = os.getenv("ELASTICSEARCH_URL", "http://localhost:9200")
    MLFLOW_TRACKING_URI: str = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5001")

    model_config = SettingsConfigDict(extra="ignore")

settings = Settings()

# Enforce secure credentials when running in production
if settings.APP_ENV == "production":
    if not settings.DATABASE_URL:
        raise ValueError("CRITICAL: DATABASE_URL environment variable must be set in production.")
    if not settings.MINIO_ROOT_PASSWORD or settings.MINIO_ROOT_PASSWORD == "statvidya_secure_minio_password_2026":
        raise ValueError("CRITICAL: MINIO_ROOT_PASSWORD must be configured with a secure value in production.")
    if not settings.ANALYTICS_API_SECRET or settings.ANALYTICS_API_SECRET == "statvidya_local_dev_secret_key_2026":
        raise ValueError("CRITICAL: ANALYTICS_API_SECRET must be configured with a secure value in production.")

