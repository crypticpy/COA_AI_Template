"""
COA AI Template - FastAPI Backend

This is the main entry point for the backend API.
TODO: Add your application-specific endpoints.
"""

import os
import logging
from datetime import datetime
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    logger.info(f"Starting COA AI Template API ({ENVIRONMENT})")
    yield
    logger.info("Shutting down COA AI Template API")


# Create FastAPI app
app = FastAPI(
    title="COA AI Template API",
    description="City of Austin AI-powered application template",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer(auto_error=False)


# =============================================================================
# Models
# =============================================================================

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    environment: str
    version: str


class AIHealthResponse(BaseModel):
    status: str
    chat_completion: str
    embeddings: str
    endpoint: str


class ErrorResponse(BaseModel):
    detail: str


# =============================================================================
# Authentication Helper
# =============================================================================

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[dict]:
    """
    Validate JWT token from Supabase.
    TODO: Implement proper Supabase JWT validation for production.
    """
    if not credentials:
        return None
    
    # For development, just check if token exists
    # TODO: Implement proper JWT validation
    # from jose import jwt
    # token = credentials.credentials
    # payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
    
    return {"token": credentials.credentials}


async def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Require authentication for an endpoint."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
        )
    
    user = await get_current_user(credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )
    
    return user


# =============================================================================
# Health Check Endpoints
# =============================================================================

@app.get(
    "/api/v1/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Health check endpoint",
)
async def health_check():
    """
    Basic health check endpoint.
    Used by load balancers and monitoring systems.
    """
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat(),
        environment=ENVIRONMENT,
        version="1.0.0",
    )


@app.get(
    "/api/v1/health/ai",
    response_model=AIHealthResponse,
    tags=["Health"],
    summary="AI service health check",
)
async def ai_health_check():
    """
    Check Azure OpenAI connectivity.
    Validates both chat and embedding endpoints.
    """
    try:
        from app.openai_provider import validate_azure_connection
        result = await validate_azure_connection()
        return AIHealthResponse(**result)
    except Exception as e:
        logger.error(f"AI health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI service unavailable: {str(e)}",
        )


# =============================================================================
# Example Protected Endpoint
# =============================================================================

@app.get(
    "/api/v1/me",
    tags=["User"],
    summary="Get current user info",
)
async def get_me(user: dict = Depends(require_auth)):
    """
    Example protected endpoint that requires authentication.
    Returns basic user information.
    """
    return {
        "authenticated": True,
        "message": "You are authenticated!",
    }


# =============================================================================
# TODO: Add Your Application Endpoints Here
# =============================================================================

# Example:
#
# from app.ai_service import chat_completion, generate_embedding
#
# class AnalyzeRequest(BaseModel):
#     text: str
#
# class AnalyzeResponse(BaseModel):
#     summary: str
#     topics: list[str]
#
# @app.post(
#     "/api/v1/analyze",
#     response_model=AnalyzeResponse,
#     tags=["Analysis"],
# )
# async def analyze_text(
#     request: AnalyzeRequest,
#     user: dict = Depends(require_auth),
# ):
#     """Analyze text using Azure OpenAI."""
#     # Your implementation here
#     pass


# =============================================================================
# Run Server (for development)
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=ENVIRONMENT == "development",
    )
