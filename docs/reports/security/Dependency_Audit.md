# Dependency Audit

## Production Dependencies

### Backend (Python/FastAPI)
- **FastAPI**: Core async web framework.
- **Uvicorn**: ASGI web server.
- **SQLModel / SQLAlchemy**: ORM mapping and database abstraction.
- **Google Generative AI**: Gemini LLM integration for crowd insights.
- **Googlemaps**: Maps routing and API client.
- **Pydantic**: Data validation and serialization.

### Frontend (TypeScript/Next.js)
- **Next.js 15.0**: React App Router framework.
- **React 19**: UI library.
- **TailwindCSS**: Utility-first CSS framework.
- **Lucide React**: Vector iconography.
- **Radix UI**: Accessible unstyled primitives for UI components.
- **Axios**: HTTP client for robust backend communication.

## Development Dependencies
- **Pytest**: Backend unit and integration testing.
- **Vitest**: Frontend unit testing.
- **Playwright / Axe-Core**: Automated End-to-End and accessibility testing.

## External APIs & Third-Party Services
- **Google Maps Platform**: Used for Venue Navigation and Transit estimations.
- **Google Gemini API**: Used for AI-driven Crowd Predictions and Transport Context evaluation.
- **Firebase Auth (Future)**: SDK configured, to be activated in production deployments.

## Licensing Summary
The project operates entirely on standard open-source libraries (MIT, Apache 2.0). All proprietary interactions (Google APIs) occur via authorized SDKs with keys provided strictly at runtime. 

*Known Upgrade Considerations*: The frontend is built on Next.js 15 RC and React 19 RC. Teams should monitor for stable final releases and upgrade standard dependencies.
