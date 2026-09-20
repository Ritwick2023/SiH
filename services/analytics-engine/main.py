from fastapi import FastAPI, Request, HTTPException, Security, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.api_key import APIKeyHeader
from config import settings
from routers import health

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Statistical Analytics & Psychometric IRT Engine for StatVidya (MoSPI SIH 26101)"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key_header = APIKeyHeader(name="Authorization", auto_error=False)

async def verify_api_key(api_key: str = Security(api_key_header)):
    """
    Validates the bearer token or analytics secret for protected endpoints.
    In development mode, requests are permitted even if header is missing for convenience.
    """
    if settings.APP_ENV == "development":
        return True
    
    if not api_key:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    
    token = api_key.replace("Bearer ", "").strip()
    if token != settings.ANALYTICS_API_SECRET:
        raise HTTPException(status_code=403, detail="Invalid API Secret")
    return True

from routers import health, assessment, analytics, recommendations, outcomes, documents

# Include routers
app.include_router(health.router)
app.include_router(assessment.router)
app.include_router(analytics.router)
app.include_router(recommendations.router)
app.include_router(outcomes.router)
app.include_router(documents.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
