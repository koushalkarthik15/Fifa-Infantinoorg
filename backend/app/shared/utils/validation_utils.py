import re


def normalize_whitespace(text: str) -> str:
    """
    Strips leading/trailing whitespace and collapses multiple internal spaces into a single space.
    """
    if not text:
        return text
    return re.sub(r"\s+", " ", text).strip()


def is_valid_email_format(email: str) -> bool:
    """
    Primitive regex validation for an email format.
    Does not replace robust library checks (like pydantic.EmailStr),
    but serves as a fast primitive if needed manually.
    """
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email))
