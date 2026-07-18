# InfantinoOrg: FIFA 2026 Tournament Assistant

![InfantinoOrg Platform](docs/assets/architecture.png) *Architecture Diagram (Placeholder)*

InfantinoOrg is the premier AI-powered tournament assistant for the FIFA World Cup 2026. Designed with a strict **feature-first architecture**, it integrates cutting-edge Gemini AI, Google Maps navigation, and responsive frontend accessibility to deliver an unparalleled fan and volunteer experience.

## Core Features
1. **Crowd Intelligence**: Real-time heatmaps and Gemini-powered predictive crowd flow modeling to avoid congestion at venues.
2. **Smart Navigation**: Turn-by-turn accessible routing with live AI context (e.g. family with stroller recommendations).
3. **Accessibility Assistant**: Unified dashboard for requesting volunteer support, finding sensory rooms, and routing accessible paths.
4. **Sustainability Tracker**: Eco-scores and green transportation routing.
5. **Volunteer Support**: Centralized hub for tournament staff tasks and incident management.

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
uv pip install -r requirements.txt
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

## Documentation
For deep-dives into the architecture, design decisions, and engineering quality reports (Lighthouse, E2E), see the official [Documentation Index](docs/04_Documentation_Index.md).
