import json
import logging
from datetime import datetime
from typing import Any, Dict

from app.shared.logging.request_context import (
    get_request_id,
    get_request_method,
    get_request_path,
)

SENSITIVE_FIELDS = {
    "password",
    "token",
    "authorization",
    "secret",
    "api_key",
    "cookie",
    "access_token",
    "refresh_token",
}


def sanitize_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    sanitized = {}
    for k, v in data.items():
        if isinstance(k, str) and any(
            sensitive in k.lower() for sensitive in SENSITIVE_FIELDS
        ):
            sanitized[k] = "***REDACTED***"
        elif isinstance(v, dict):
            sanitized[k] = sanitize_dict(v)
        else:
            sanitized[k] = v
    return sanitized


class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.fromtimestamp(record.created).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "module": record.module,
        }

        req_id = get_request_id()
        if req_id:
            log_data["request_id"] = req_id

        req_method = get_request_method()
        if req_method:
            log_data["method"] = req_method

        req_path = get_request_path()
        if req_path:
            log_data["path"] = req_path

        # Include extra fields passed via `extra={...}`
        if hasattr(record, "extra_data") and isinstance(record.extra_data, dict):
            log_data.update(sanitize_dict(record.extra_data))

        if hasattr(record, "duration"):
            log_data["duration"] = record.duration

        if hasattr(record, "status_code"):
            log_data["status_code"] = record.status_code

        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_data)


class TextFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        timestamp = datetime.fromtimestamp(record.created).isoformat()
        req_id = get_request_id()
        req_id_str = f" [{req_id}]" if req_id else ""

        msg = f"{timestamp} {record.levelname} [{record.name}]{req_id_str} - {record.getMessage()}"

        if hasattr(record, "extra_data") and isinstance(record.extra_data, dict):
            msg += f" | {sanitize_dict(record.extra_data)}"

        if record.exc_info:
            msg += f"\n{self.formatException(record.exc_info)}"

        return msg
