from fastapi import FastAPI
from dotenv import load_dotenv
import os
from .lib.config import config
from .middleware.auth_middleware import JWTMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize rate limiter (T043)
limiter = Limiter(key_func=get_remote_address)
logger.info(f"Rate limit: {config.RATE_LIMIT_REQUESTS} requests per {config.RATE_LIMIT_WINDOW} seconds")

# Load environment variables
load_dotenv()

# Create FastAPI app instance
app = FastAPI(
    title="Todo API",
    description="A secure, scalable RESTful API for managing todo tasks",
    version="1.0.0",
    debug=config.DEBUG,
)

# Add rate limiting (T043)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS or ["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware
app.add_middleware(JWTMiddleware)

# Include routers
from .api.task_router import router as task_router
from .api.auth_router import router as auth_router

# Add routers to the app
app.include_router(task_router, prefix="/api/{user_id}", tags=["tasks"])
app.include_router(auth_router, prefix="/auth", tags=["authentication"])


# Add exception handlers for comprehensive error handling
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    logger.error(f"Validation Error: {exc}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )


@app.middleware("http")
async def log_requests(request, call_next):
    """Add request/response logging for debugging and monitoring (T043)"""
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response


@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "todo-api"}