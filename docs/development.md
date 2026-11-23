# PassForge Development Guide

## Prerequisites

- **Node.js:** `v20+` (tested on Node `v24.20.0`)
- **npm:** `v10+` (tested on npm `v11.19.0`)

---

## Workspace Setup

Clone the repository and install dependencies from the root directory:

```bash
npm install
```

This installs all dependencies across `apps/frontend`, `apps/backend`, and `packages/shared`, automatically linking shared packages via `npm workspaces`.

---

## Routing & Application Structure

PassForge features two primary user-facing experiences:

1. **Public Marketing Website (`/`, `/features`, `/how-it-works`, `/designs`, `/use-cases`, `/faq`):**
   - Warm, editorial presentation showcasing the product vision, capabilities, and dual design systems.
   - Deep links directly to workflow and features sections.
2. **PassForge Studio (`/app`):**
   - Interactive organizer workflow: Event Settings, CSV Import, Attendee Directory, and Ticket Designer with live multi-format preview.

---

## Available Root Scripts

| Command | Description |
|---|---|
| `npm run dev` | Concurrently starts both Express backend (`:3000`) and Vite frontend (`:5173`) |
| `npm run dev:backend` | Starts Express backend server in development mode using `tsx` |
| `npm run dev:frontend` | Starts Vite development server with hot-module reload |
| `npm run build` | Compiles frontend production bundle into `apps/frontend/dist` |
| `npm test` | Runs the automated backend test suite (28 assertions) |
| `npm run render` | Generates all 4 Hyper Elements ticket formats to `apps/backend/output/` |

---

## CSV Upload & Import Specification

### Supported Column Names
The CSV parser automatically detects variations of standard attendee columns:
- **Full Name:** `Full Name`, `Name`, `Attendee Name`, `Attendee`
- **Email:** `Email Address`, `Email`, `Mail`
- **Ticket Type:** `Ticket Type`, `Category`, `Tier`, `Pass`, `Type`
- **Seat Number:** `Seat Number`, `Seat`, `Seat No`, `Desk`

Custom column mappings can also be specified interactively via the frontend or passed in the API payload.

### Validation Rules
1. **Name:** Required string (min 1 character, max 120 characters).
2. **Email:** Required, valid RFC 5322 email format. Case-insensitive duplicate detection flags duplicate emails within the batch.
3. **Ticket Type:** Required (default: `General` if unmapped).
4. **Seat Number:** Optional (default: `General Admission` or `Unassigned`).
5. **Empty Rows:** Empty lines or rows consisting solely of whitespace or commas are skipped automatically.
6. **Limits:** Max file size 5MB; max row count 5,000 rows.

---

## Hyper Elements 0.5.2 Reference

The ticket rendering engine compiles React JSX elements into 4 formats:
- Documentation guide is located at: `node_modules/@hyper-elements/react/GUIDE.md`
- Complete API reference is located at: `node_modules/@hyper-elements/react/REFERENCE.md`

Supported Roots:
- `<Page>`: Responsive HTML Web Ticket
- `<Email>`: Compatible Table-based Email HTML
- `<Document>`: Vector PDF Admission Pass
- `<Canvas>`: High-Resolution PNG Graphic (via `renderImage`)

---

## API Endpoints Reference

### Health
- `GET /api/health` — Returns server uptime and status.

### Event Configuration
- `GET /api/events/current` — Returns the current active event.
- `POST /api/events` — Updates the current active event.

### Attendees
- `GET /api/attendees?search=&ticketType=` — Returns attendee list with optional search and category filters.
- `POST /api/attendees/import` — Ingests a CSV file (multipart `file` field or JSON body `{ csv: "..." }`). Returns structured summary with valid records and row-level error reports.
- `POST /api/attendees/reset` — Resets attendee list to default sample attendee.

### Ticket Rendering
- `GET /api/ticket-data` — Returns sample ticket model and recent render results.
- `POST /api/generate/:format` — Generates ticket in `email`, `page`, `pdf`, `png`, or `all` formats. Supports optional query parameter `?attendeeId=...`.
- `GET /api/preview/:format?ticketId=...` — Streams the generated file directly to browser (`text/html`, `application/pdf`, `image/png`).
- `GET /api/download/:format?ticketId=...` — Downloads the generated ticket as an attachment.
- `POST /api/test-long-name` — Renders stress-test attendee name across all 4 formats.
- `GET /api/verify` — Programmatically runs the verification suite.
