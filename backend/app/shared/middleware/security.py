from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Injects OWASP-recommended security headers into all outbound responses.
    """
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        
        # Prevent MIME-type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # Prevent clickjacking (same origin allowed if UI requires framing)
        response.headers["X-Frame-Options"] = "DENY"
        
        # Enforce strict referrer policies
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        return response
