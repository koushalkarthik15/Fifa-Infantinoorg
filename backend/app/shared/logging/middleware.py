import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.shared.logging.logger import get_logger
from app.shared.logging.request_context import (
    set_request_id,
    set_request_method,
    set_request_path,
)

logger = get_logger(__name__)


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        # Generate Request ID using hex format as requested
        req_id = uuid.uuid4().hex

        # Set context variables
        set_request_id(req_id)
        set_request_method(request.method)
        set_request_path(request.url.path)

        start_time = time.perf_counter()

        try:
            response = await call_next(request)
            duration = time.perf_counter() - start_time

            logger.info(
                f"{request.method} {request.url.path} - {response.status_code}",
                extra={
                    "extra_data": {
                        "duration": round(duration, 4),
                        "status_code": response.status_code,
                    }
                },
            )

            # Inject the exact structured logging Request ID into the response headers
            response.headers["X-Request-ID"] = req_id
            return response

        except Exception as e:
            duration = time.perf_counter() - start_time
            # Use logger.exception() to properly capture tracebacks
            logger.exception(
                f"Unhandled exception during {request.method} {request.url.path}",
                extra={
                    "extra_data": {"duration": round(duration, 4), "status_code": 500}
                },
            )
            raise e
