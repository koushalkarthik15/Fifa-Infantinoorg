# DevOps Report

## Overview
This report documents the CI/CD and containerization strategy for InfantinoOrg in preparation for production deployment (Milestone 5.5).

## Containerization Strategy
### Backend
- **Base Image**: `python:3.12-slim` (Minimizes OS overhead).
- **Package Manager**: `uv` (Astral's lightning-fast Rust-based package installer).
- **Optimizations**: 
  - `PYTHONUNBUFFERED=1` (Prevents stdout delays in logs).
  - `PYTHONDONTWRITEBYTECODE=1` (Prevents `.pyc` clutter).
- **Security**: Runs under a non-root `appuser`.
- **Health Checks**: Built-in curl validation pointing to `/api/v1/health`.

### Frontend
- **Base Image**: `node:20-alpine` (Minimal footprint).
- **Build Mode**: Next.js `standalone` (Automatically trims unused dependencies via Next.js output file tracing).
- **Security**: Runs under a non-root `nextjs` user.
- **Layers**: Multi-stage build (deps -> builder -> runner) ensures source code and development tools never reach the final image.

## Orchestration (Docker Compose)
The production compose configuration (`docker-compose.prod.yml`) provisions an isolated bridge network (`infantino-network`). The frontend explicitly waits for the backend's health check to pass before initializing. Both services are bound by an `unless-stopped` restart policy to ensure resilience.

## CI/CD Pipeline (GitHub Actions)
The `.github/workflows/ci.yml` pipeline automatically triggers on `push` and `pull_request` to `main`.
- **Concurrency**: Cancels superseded runs automatically to save compute minutes.
- **Caching**: Leverages `actions/cache` for Python dependencies and npm package-lock caching.
- **Verification**: Enforces ESLint, Pytest, Ruff, and Black styling.
- **Docker Validation**: Uses Docker Buildx with GitHub Actions caching to build (but not push) both images to ensure the `Dockerfile` definitions remain valid.
