from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get JWT secret from environment
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

security = HTTPBearer()


class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Skip authentication for health check, root, and auth endpoints
        if request.url.path in ["/", "/health"] or request.url.path.startswith("/auth/"):
            return await call_next(request)

        # Handle OPTIONS requests for CORS preflight
        if request.method == "OPTIONS":
            response = await call_next(request)
            return response

        # For API endpoints that require authentication
        if request.url.path.startswith("/api/"):
            # Extract token from Authorization header
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={
                        "success": False,
                        "error": "Authorization header missing or invalid format",
                        "message": "Authorization header missing or invalid format"
                    }
                )

            token = auth_header.split(" ")[1]  # Get the token part after "Bearer "

            try:
                # Decode the JWT token
                payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
                user_id: str = payload.get("sub")
                if user_id is None:
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content={
                            "success": False,
                            "error": "Could not validate credentials",
                            "message": "Could not validate credentials"
                        }
                    )

                # Add user_id to request state for use in route handlers
                request.state.user_id = user_id
            except JWTError:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={
                        "success": False,
                        "error": "Could not validate credentials",
                        "message": "Could not validate credentials"
                    }
                )

        response = await call_next(request)
        return response