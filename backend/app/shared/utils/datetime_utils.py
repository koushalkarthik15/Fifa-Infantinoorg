from datetime import datetime, timezone

def utcnow() -> datetime:
    """
    Returns the current timezone-aware UTC datetime.
    Ensures no time-drift across different environment regions.
    """
    return datetime.now(timezone.utc)

def format_iso8601(dt: datetime) -> str:
    """
    Safely format a datetime into strict ISO-8601 with Z suffix for UTC.
    """
    if dt.tzinfo is None:
        # If naive, assume UTC
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace('+00:00', 'Z')
