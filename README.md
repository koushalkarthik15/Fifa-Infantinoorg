# InfantinoOrg: FIFA 2026 Tournament Assistant

![InfantinoOrg Match-Day Companion](docs/assets/hero-image.png)

InfantinoOrg is the premier AI-powered tournament match-day companion for fans attending the FIFA World Cup 2026. Designed with a strict **feature-first architecture**, it integrates cutting-edge Gemini AI, Google Maps navigation, and responsive frontend accessibility to deliver an unparalleled fan experience.

## Demo Scenario: The Fan Journey
InfantinoOrg is demonstrated through the journey of a fictional football fan, "Gianni Infantino", attending the FIFA World Cup 2026 Final at MetLife Stadium. From planning the trip and navigating crowds to accessing volunteer assistance and leaving the venue efficiently, the platform showcases how AI enhances the entire match-day experience.

## Core Features
1. **Crowd Intelligence**: Real-time heatmaps and Gemini-powered predictive crowd flow modeling to avoid congestion at venues.
2. **Smart Navigation**: Turn-by-turn accessible routing with live AI context (e.g. public transit recommendations for sustainability).
3. **Ambient AI Assistant**: Unified chat interface for requesting volunteer support, reporting incidents, and answering questions.
4. **Sustainability Tracker**: Eco-scores, public transit rewards, and nearby water/recycling hub routing.
5. **Volunteer Triage**: AI instantly routes fan requests to the nearest, most qualified volunteer.

## Technology Stack
- **Frontend**: Next.js 15, React 19, TailwindCSS, Radix UI, TypeScript
- **Backend**: FastAPI, Python 3.12, SQLModel, Uvicorn
- **AI/APIs**: Google Gemini API, Google Maps Platform
- **Testing**: Pytest, Vitest, Playwright (axe-core)

## Repository Structure
```text
infantinoorg/
├── backend/            # FastAPI Application (Python)
├── frontend/           # Next.js Application (TypeScript)
├── docs/               # Official Documentation & Engineering Reports
├── docker/             # Containerization configs
└── scripts/            # Build utilities
```

## Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install uv
uv pip install -e .
cp .env.example .env # Configure your Gemini & Maps API keys
uv run uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to view the platform. Visit `http://localhost:8000/docs` to view the Swagger API documentation.

## Security Configuration

### Environment Variables

All secrets and credentials are injected exclusively via environment variables. No credentials are hardcoded in source code.

Copy `.env.example` to `.env` and populate with your credentials:

```bash
cp .env.example .env
# Then edit .env with your actual API keys
```

**Required variables for full functionality:**

| Variable | Description | Where to obtain |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini AI key | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `GOOGLE_MAPS_API_KEY` | Google Maps Platform key | [GCP Console](https://console.cloud.google.com/google/maps-apis) |
| `FIREBASE_PROJECT_ID` | Firebase project identifier | [Firebase Console](https://console.firebase.google.com) |
| `CORS_ORIGINS` | Allowed frontend origins (JSON array) | Set to your frontend URL |
| `DATABASE_URL` | Database connection string | SQLite for local, Neon for production |

### CORS Configuration

`CORS_ORIGINS` **must be explicitly set**. The application defaults to an empty list (denies all cross-origin requests) if not configured.

```bash
# Local development
CORS_ORIGINS=["http://localhost:3000"]

# Production
CORS_ORIGINS=["https://infantino.org","https://www.infantino.org"]
```

### Production Secret Injection (CI/CD)

**GitHub Actions:** Add secrets in `Settings → Secrets and variables → Actions`. Reference as `${{ secrets.GEMINI_API_KEY }}`.

**Vercel:** Add secrets in `Project → Settings → Environment Variables`.

### Security Rules

- ❌ Never commit `.env` files containing real credentials
- ❌ Never commit Firebase Admin SDK service account JSON files
- ❌ Never hardcode API keys in source code
- ✅ Rotate any keys that were previously exposed
- ✅ Use feature flags (`ENABLE_GEMINI`, `ENABLE_MAPS`, `ENABLE_FIREBASE`) to disable services when keys are not available

## Documentation
For deep-dives into the architecture, design decisions, and engineering quality reports (Lighthouse, E2E), see the official [Documentation Index](docs/04_Documentation_Index.md).
