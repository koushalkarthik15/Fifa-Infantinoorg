# InfantinoOrg Backend

The Python-powered FastAPI backend serving the InfantinoOrg platform, integrating Gemini AI and Google Maps Platform to provide real-time crowd, transit, and sustainability intelligence.

## Technologies
- **Framework**: FastAPI
- **ORM**: SQLModel / SQLAlchemy
- **Dependency Injection**: Native FastAPI `Depends` pattern
- **Testing**: Pytest

## Getting Started

```bash
# Create virtual environment
python -m venv .venv
# Activate
source .venv/bin/activate # Windows: .venv\Scripts\activate

# Install dependencies using UV
pip install uv
uv pip install -r requirements.txt

# Start Server
uv run uvicorn app.main:app --reload
```

## Architecture
The backend strictly adheres to a **Feature-First Architecture** with a clear Service Layer boundary.
- `app/features/`: Feature modules (e.g., `crowd`, `navigation`) containing `router.py`, `service.py`, `repository.py`, and domain models.
- `app/shared/`: Global utilities, exceptions, and dependency injection providers.
- `app/providers/`: Concrete implementations for third-party abstractions (Gemini, Google Maps).

To guarantee optimal worker cold-start times, external API providers are initialized strictly via thread-safe lazy loading.
