# PassForge Deployment & Production Guide

This guide describes how to build, configure, and deploy the PassForge application for public presentation and production environments.

---

## 1. Architecture Overview

PassForge is structured as an npm-workspaces monorepo:

- **Frontend (`apps/frontend`):** React 19 + TypeScript + Vite. Features both the public-facing marketing website (`/`, `/features`, `/how-it-works`) and the interactive PassForge Studio (`/app`).
- **Backend (`apps/backend`):** Node.js 24 + Express 5 with `@hyper-elements/react` server-side rendering engine and `canvas` native bindings.
- **Shared (`packages/shared`):** Zod schemas, TypeScript contracts, and data transfer types shared across both client and server.

In production, the backend server can serve both the `/api/*` endpoints, the `/output/*` generated ticket artifacts, and the built static frontend client (`apps/frontend/dist`) as a unified single-port application.

---

## 2. Environment Variables

Create a `.env` file in the repository root or configure your hosting provider's environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Port for the Express backend server |
| `NODE_ENV` | `development` | Set to `production` for production builds |
| `CORS_ORIGIN` | `*` | Allowed origins (e.g. `https://passforge.app` or `*`) |
| `VITE_API_BASE_URL` | `http://localhost:3000` | Base API URL configured for client-side API requests |
| `MAX_UPLOAD_SIZE_BYTES` | `5242880` | Maximum uploaded CSV file size (5MB limit) |
| `MAX_CSV_ROWS` | `5000` | Maximum rows allowed per CSV batch |

---

## 3. Production Build Process

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the Frontend Static Assets
```bash
npm run build
```
This builds the optimized production bundle to `apps/frontend/dist/`.

### Step 3: Run the Automated Verification Suite
```bash
npm test
```
Verifies all 28 automated assertions (CSV parsing, Zod validation, ticket generation, and 4 Hyper Elements SSR outputs).

### Step 4: Start the Production Server
```bash
npm run start
# Or directly via Node:
node --loader tsx apps/backend/src/server.ts
```

When `apps/frontend/dist` is present, the Express backend automatically serves the public marketing website, documentation routes, and Studio app directly on `http://localhost:PORT/`.

---

## 4. Production Limitations & Design Boundaries (Audit)

To maintain clarity and product honesty, the current release has the following deliberate architectural boundaries:

1. **In-Memory State:**
   - Event details and imported attendee records are stored in high-performance in-memory repositories.
   - Restarting the server process resets state back to the default sample event (`KIET TechFest 2027`) and attendee.
   - *Roadmap note:* Milestone 4 adds persistent database adapters (SQLite/PostgreSQL) if long-term persistence is required.

2. **No User Authentication or Payments:**
   - PassForge is intentionally designed as an open studio tool without user login, session cookies, or payment processing bloat.
   - Organizers can immediately use the tool without creating accounts.

3. **Bulk Generation & ZIP Export (Milestone 4):**
   - Individual preview and format downloads (PNG, PDF, HTML) are fully operational.
   - Background multi-attendee ZIP batch generation is marked as upcoming for Milestone 4.

4. **Native Canvas Dependencies:**
   - Generating high-resolution PNG badges requires the `canvas` npm package (Cairo/Pango binaries). Ensure standard build dependencies (`build-essential`, `libcairo2-dev`, `libpango1.0-dev`) are available if deploying to bare-metal Linux or Docker containers.

---

## 5. Security Best Practices

- **File Upload Limits:** CSV uploads are restricted to 5MB and 5,000 rows to prevent Denial-of-Service or memory exhaustion.
- **Input Sanitization:** Every attendee row is validated against strict Zod schemas before rendering.
- **CORS Protection:** Configurable via `CORS_ORIGIN` environment variable.
- **XSS Mitigation:** Ticket HTML renders through Hyper Elements' typed JSX tree; no raw `dangerouslySetInnerHTML` is used.

---

## 6. Health & Monitoring

- Health Endpoint: `GET /api/health`
- Response:
  ```json
  {
    "status": "ok",
    "uptime": 124.5,
    "timestamp": "2026-11-24T00:00:00.000Z",
    "version": "1.0.0"
  }
  ```
