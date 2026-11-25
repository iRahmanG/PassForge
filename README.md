# PassForge

> High-performance personalized event ticket engine & design studio powered by React and Hyper Elements.

---

## 🎯 Overview

**PassForge** is an open event ticketing engine and design studio. It enables event organizers to configure events, import attendee rosters via CSV with intelligent column mapping, customize typography and branding with watermark overlays, live-preview tickets across four distinct rendering formats, and batch-export production-ready ticket packages in a single organized ZIP archive.

Every ticket is rendered through unified **Hyper Elements** (`@hyper-elements/react`) Server-Side Rendering (SSR), producing high-fidelity outputs across Email, Web, PDF, and PNG formats from a single strongly-typed data model.

---

## ⚡ How Hyper Elements Powers PassForge

Instead of writing and maintaining four completely separate template stacks (an MJML/HTML email template, a web page, a PDF generation script, and a canvas image script), PassForge leverages **Hyper Elements** to write declarative React templates once. Each ticket layout (such as *Cyber Tech* or *Premium Editorial*) defines four dedicated root components consuming the same typed ticket data:

```mermaid
flowchart LR
    Data["Typed TicketData<br/>(Attendee + Event + Brand Kit)"]

    Data --> EmailTpl["&lt;Email&gt;<br/>TechEmail / EditorialEmail"]
    Data --> PageTpl["&lt;Page&gt;<br/>TechPage / EditorialPage"]
    Data --> DocTpl["&lt;Document&gt;<br/>TechDocument / EditorialDocument"]
    Data --> CanvasTpl["&lt;Canvas&gt;<br/>TechCanvas / EditorialCanvas"]

    EmailTpl -->|render()| OutEmail["📧 Email HTML<br/>(Table-based & inline CSS)"]
    PageTpl -->|render()| OutPage["🌐 Web Ticket<br/>(Responsive mobile-ready HTML)"]
    DocTpl -->|renderPdf()| OutPdf["📄 Printable PDF<br/>(Vector A4 document with QR)"]
    CanvasTpl -->|renderImage()| OutPng["🖼️ Badge PNG<br/>(2x Retina card graphic)"]
```

### The 4 Specialized Roots in PassForge

| Root Component | Render Function | Output Format | How PassForge Uses It |
|---|---|---|---|
| `<Email>` | `render(jsx)` | HTML (String) | Compiles table-based email layouts with inline styles, bulletproof across Outlook, Gmail, and Apple Mail for automated confirmation emails. |
| `<Page>` | `render(jsx)` | HTML (String) | Emits a responsive web page with metadata, dynamic viewport scaling, and mobile breakpoints (`breakpoints={{ mobile: 560 }}`) for digital admission passes. |
| `<Document>` | `renderPdf(jsx)` | Binary Buffer (`%PDF-`) | Generates a vector PDF ticket with scannable QR matrices and print margins, ideal for print-at-home or on-site badge printing. |
| `<Canvas>` | `renderImage(jsx)` | Binary Buffer (`\x89PNG`) | Renders pixel-perfect 2x Retina PNG card badges with centered opacity watermarks, exact ticket aspect ratios, and local font rendering via Cairo/Pango bindings. |

### Code Example: Unified Rendering Pipeline

```tsx
import { render, renderPdf, renderImage } from '@hyper-elements/react';
import { getDesignTemplates } from './templates/designs/registry.js';

// 1. Fetch template component tree based on organizer's selected design
const { Email, Page, Document, Canvas } = getDesignTemplates(designId);

// 2. Render all 4 formats from the exact same ticket & branding data:
const emailHtml = await render(<Email ticket={ticket} branding={branding} />);
const pageHtml  = await render(<Page ticket={ticket} branding={branding} />);
const pdfBuffer = await renderPdf(<Document ticket={ticket} branding={branding} />);
const pngBuffer = await renderImage(<Canvas ticket={ticket} branding={branding} />);
```

---

## ✨ Features

- **Guided 4-Step Event Creation Workflow:** Seamless step-by-step progress from Event Details → Import Attendees → Design Tickets → Generate & Export.
- **Multiple Design Systems:**
  - **Cyber Tech:** High-contrast dark-mode terminal layout designed for developer conferences, hackathons, and tech summits.
  - **Premium Editorial:** Warm parchment typography and classical border composition designed for galas, keynotes, and ceremonies.
- **Brand Kit Customization:**
  - Curated color swatches + custom HEX picker with live accent propagation.
  - Multi-family typography presets (Modern Sans, Technical Mono, Editorial Serif, Humanist Sans, Classic Serif).
  - Organizer logo upload with automatic aspect-ratio-preserved centered watermark overlay.
- **Robust CSV Ingestion:**
  - Drag-and-drop file upload with raw CSV paste fallback.
  - Automatic column detection for Name, Email, Ticket Tier, and Seat.
  - In-browser validation, duplicate email detection, and row-level error reporting.
- **High-Throughput Batch Generation:**
  - Asynchronous background worker queue with real-time progress tracking.
  - Multi-format batch generation with selective tier/attendee filtering.
  - Unified zero-PII ZIP archive bundling with structured manifest metadata.
  - Automatic directory retention and orphaned job cleanup.

---

## 🏛️ Monorepo Architecture

PassForge is structured as an **npm-workspaces monorepo**:

```
PassForge/
├── apps/
│   ├── frontend/         # React 19 + TypeScript + Vite Single Page Application
│   │   ├── src/
│   │   │   ├── components/layout/   # StepProgressBar, Header, Footer
│   │   │   ├── components/ui/       # Design system primitives (Button, Card, Badge, Modal, Alert, Input)
│   │   │   ├── features/event/      # Event configuration form & summary card
│   │   │   ├── features/attendees/  # CSV drag-and-drop uploader, column mapper, table
│   │   │   ├── features/tickets/    # DesignGallery, BrandingControls, LiveCanvas, StudioToolbar
│   │   │   ├── hooks/               # useEvent, useAttendees, useDesignSystem, useTicketRender
│   │   │   ├── services/api.ts      # Typed REST API client
│   │   │   ├── App.tsx              # Guided workflow orchestrator & state manager
│   │   │   └── main.tsx             # React entrypoint
│   │   └── vite.config.ts           # Vite proxy configuration (/api -> http://localhost:3000)
│   │
│   └── backend/          # Node.js 24 + Express 5 + Hyper Elements SSR Service
│       ├── src/
│       │   ├── config/              # Constants and sample event/attendee data
│       │   ├── modules/event/       # In-memory event configuration service
│       │   ├── modules/attendee/    # Papa Parse ingestion, Zod validator, duplicate email filter
│       │   ├── modules/ticket/      # TicketData synthesizer with QR code generation
│       │   ├── modules/design/      # Design service holding template and branding state
│       │   ├── modules/bulk/        # High-throughput background generation queue & ZIP archiver
│       │   ├── templates/designs/   # Design Registry & Templates:
│       │   │   ├── tech/            # TechEmail, TechPage, TechDocument, TechCanvas
│       │   │   ├── editorial/       # EditorialEmail, EditorialPage, EditorialDocument, EditorialCanvas
│       │   │   └── registry.ts      # Central Design Registry
│       │   ├── services/rendering/  # Unified SSR rendering service for all 4 output formats
│       │   ├── routes/              # Express API routers (event, attendee, ticket, design, bulk)
│       │   ├── middleware/          # Multer file upload & validation middleware
│       │   └── server.ts            # Express server (Port 3000)
│       └── assets/fonts/            # Local TrueType fonts for offline rendering
│
├── packages/
│   └── shared/           # Shared TypeScript domain contracts & Zod validation schemas
│       ├── src/
│       │   ├── types/               # EventInfo, AttendeeInfo, TicketData, DesignConfig, BulkJob
│       │   ├── schemas/             # eventSchema, attendeeSchema, designConfigSchema, bulkSchema
│       │   └── index.ts
│       └── package.json
│
├── docs/                 # System architecture specification
├── package.json          # Root workspace configuration
└── tsconfig.base.json    # Shared TypeScript compiler options
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Servers
Runs backend and frontend concurrently:
```bash
npm run dev
```
- **Frontend Studio & Landing Page:** [http://localhost:5173](http://localhost:5173)
- **Backend REST API:** [http://localhost:3000](http://localhost:3000)

Or run each service individually:
```bash
npm run dev:backend   # Express backend on port 3000
npm run dev:frontend  # Vite frontend on port 5173
```

### 3. Run Automated Verification Tests
Executes the comprehensive automated test suite verifying ticket rendering across all 4 formats, Zod schemas, CSV ingestion, background bulk processing, and ZIP archiving:
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 📦 Output Formats & Verification

| Format | Technology | Dimensions / Spec | Use Case |
|---|---|---|---|
| **Email HTML** | `@hyper-elements/react` `<Email>` | Inline CSS, responsive tables | Dispatch via SMTP/SendGrid/SES |
| **Web Ticket** | `@hyper-elements/react` `<Page>` | Responsive viewport (desktop + mobile) | Direct attendee check-in link |
| **Printable PDF** | `@hyper-elements/react` `<Document>` | Vector A4/Letter (%PDF- header) | Physical badge printing / download |
| **Retina PNG** | `@hyper-elements/react` `<Canvas>` | Exact-fit 720px card (PNG signature) | Digital wallet / social sharing |

---

## 🔒 Security & Privacy

- **Strict Input Validation:** Every CSV row and API payload is verified against strict Zod domain schemas.
- **Upload Boundaries:** File uploads are limited to 5MB and 5,000 records to prevent memory exhaustion.
- **Zero-PII Manifests:** ZIP export archives maintain strict privacy standards by omitting attendee emails and names from machine-readable manifest indices.
- **No Unnecessary Infrastructure:** Zero mandatory external database or authentication services required for full core functionality.

---

## 📄 License

ISC License.
