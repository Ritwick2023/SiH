import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "StatVidya Analytics Engine"
    APP_ENV: str = os.getenv("NEXT_PUBLIC_APP_ENV", "development")
    ANALYTICS_API_SECRET: str = os.getenv("ANALYTICS_API_SECRET", "statvidya_local_dev_secret_key_2026")
    
    # Databases & Queues
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://statvidya_user:statvidya_secure_pg_pass_2026@localhost:5432/statvidya_db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")
    
    # Storage & Search
    MINIO_ENDPOINT: str = os.getenv("MINIO_ENDPOINT", "localhost:9000")
    MINIO_ROOT_USER: str = os.getenv("MINIO_ROOT_USER", "statvidya_admin")
    MINIO_ROOT_PASSWORD: str = os.getenv("MINIO_ROOT_PASSWORD", "statvidya_secure_minio_password_2026")
    ELASTICSEARCH_URL: str = os.getenv("ELASTICSEARCH_URL", "http://localhost:9200")
    MLFLOW_TRACKING_URI: str = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5001")

    model_config = SettingsConfigDict(extra="ignore")

settings = Settings()
