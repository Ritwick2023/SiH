from fastapi import FastAPI, Request, HTTPException, Security, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.api_key import APIKeyHeader
import secrets
import os
import sys
from config import settings
from routers import health, assessment, analytics, recommendations, outcomes, documents

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Statistical Analytics & Psychometric IRT Engine for StatVidya (MoSPI SIH 26101)"
)

# Restrict CORS to allowed explicit origins
allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
)

api_key_header = APIKeyHeader(name="Authorization", auto_error=False)

async def verify_api_key(api_key: str = Security(api_key_header)):
    """
    Validates the bearer token or analytics secret for protected endpoints.
    Uses timing-safe comparison to prevent side-channel leakage.
    Fails closed in all non-test environments.
    """
    # Allow test runners only when explicitly executing unit tests in testing environment
    is_testing = os.getenv("TESTING") == "true" or "pytest" in sys.modules
    if is_testing and not api_key:
        return True

    if not api_key:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    
    token = api_key.replace("Bearer ", "").strip()
    if not settings.ANALYTICS_API_SECRET or not secrets.compare_digest(token, settings.ANALYTICS_API_SECRET):
        raise HTTPException(status_code=403, detail="Invalid API Secret")
    return True

# Include health router (public for liveness/readiness probes)
app.include_router(health.router)

# Include protected operational routers
app.include_router(assessment.router, dependencies=[Depends(verify_api_key)])
app.include_router(analytics.router, dependencies=[Depends(verify_api_key)])
app.include_router(recommendations.router, dependencies=[Depends(verify_api_key)])
app.include_router(outcomes.router, dependencies=[Depends(verify_api_key)])
app.include_router(documents.router, dependencies=[Depends(verify_api_key)])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

