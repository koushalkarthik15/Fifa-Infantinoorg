# InfantinoOrg Frontend

The frontend interface for the InfantinoOrg platform, built to maximize performance, accessibility, and modern aesthetics using Next.js 15 App Router.

## Technologies
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS
- **Components**: Radix UI primitives for WCAG AA compliance
- **Testing**: Vitest (Unit), Playwright (E2E Integration)

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server with Turbopack
npm run dev
```

## Available Scripts
- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Compiles the optimized production bundle.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint.
- `npm run test`: Runs Vitest unit tests.
- `npm run test:e2e`: Runs Playwright End-to-End and accessibility audits.

## Architecture
The frontend strictly adheres to a **Feature-First Architecture**.
- `src/features/`: Contains feature-specific components, hooks, and services (e.g., `crowd-ai`, `sustainability`).
- `src/components/ui/`: Global, highly reusable UI atoms (buttons, cards).
- `src/app/`: Next.js routing configuration.

Heavy interactive components (like Heatmaps and Maps) are dynamically imported (`next/dynamic`) to ensure blazing-fast First Contentful Paint times.
