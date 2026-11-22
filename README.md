# PassForge — Milestone 3: Ticket Design System & Live Preview

> Bulk personalized event ticket generation application for the **Hyper Elements Template Challenge**.

---

## 🎯 Project Overview

PassForge enables event organizers to configure an event, upload attendee rosters via CSV with flexible column mapping, customize branding, choose between professionally designed ticket templates, and generate personalized tickets in four distinct formats powered by **Hyper Elements**:

1. **Personalized Confirmation Email** (`<Email>`)
2. **Responsive Digital Web Ticket** (`<Page>`)
3. **Printable Admission Pass PDF** (`<Document>`)
4. **Visual Ticket Badge PNG** (`<Canvas>`)

---

## 🎨 Milestone 3: Ticket Design System & Live Preview

### Two Genuinely Distinct Layouts

PassForge provides two genuinely different ticket architectures that consume the exact same typed `TicketData` model:

| Design Feature | Design A: Tech / Hackathon (`tech`) | Design B: Premium Editorial & Gala (`editorial`) |
|---|---|---|
| **Aesthetic** | Futuristic dark navy, high-contrast | Warm parchment cream, classical elegance |
| **Background** | `#0a0e17` dark navy with `#0f172a` cards | `#faf8f5` cream with `#ffffff` parchment cards |
| **Default Accent** | Electric Cyan (`#06b6d4`) | Amber Terracotta (`#b45309`) |
| **Typography** | Modern bold sans-serif, uppercase accents | Refined editorial serif (`Georgia, Times, serif`) |
| **Layout Composition** | Side-by-side terminal card with tech stub | Centered masthead with elegant border dividers |
| **QR Integration** | Dark-themed matrix container | Parchment check-in credential stub |

### Branding Customization

- **Accent Color Selection:** Palette swatches (Electric Cyan, Indigo, Amber, Emerald, Crimson, Royal Violet, Sunset Flame, Midnight Slate) + custom hex input & native color picker.
- **Event / Sponsor Logo:** Optional logo upload (PNG, SVG, JPG) with base64 buffer handling passed into Hyper Elements SSR (`Document` and `Canvas`).
- **Reset to Defaults:** Instant reset button restoring template defaults.
- **State Persistence:** Saved in-memory via `POST /api/designs/current` and retrievable via `GET /api/designs/current`.

### Live Ticket Preview

- **4-Format Switcher:** Instant switching between Canvas PNG, Responsive Page, Email HTML, and Printable PDF.
- **Desktop / Mobile Viewport Toggle:** Tests responsive mobile breakpoints (`breakpoints={{ mobile: 560 }}`) for `<Page>`.
- **Attendee Switcher:** Preview any imported attendee, plus dedicated stress test options for extreme long names and missing seat fallbacks ("Open Seating").
- **Real-Time Previews:** Server returns rendered HTML, base64 data URLs for retina PNGs, and vector PDF links.

---

## 🏛️ Monorepo Architecture

The project is structured as an **npm-workspaces monorepo**:

```
PassForge/
├── apps/
│   ├── frontend/         # React 19 + TypeScript + Vite Single Page Application
│   │   ├── src/
│   │   │   ├── components/layout/   # Header & Footer
│   │   │   ├── components/ui/       # Design system primitives (Button, Card, Badge, Modal, Alert, Input)
│   │   │   ├── features/event/      # Event configuration form & summary card
│   │   │   ├── features/attendees/  # CSV drag-and-drop uploader, column mapper, import summary, table
│   │   │   ├── features/tickets/    # DesignGallery, BrandingControls, PreviewToolbar, TicketPreview, TicketDesigner
│   │   │   ├── hooks/               # useEvent, useAttendees, useDesignSystem, useTicketRender
│   │   │   ├── services/api.ts      # REST API client
│   │   │   ├── App.tsx              # Main application shell
│   │   │   └── main.tsx             # React entrypoint
│   │   ├── vite.config.ts           # Vite proxy configuration (/api -> http://localhost:3000)
│   │   └── package.json
│   │
│   └── backend/          # Node.js 24 + Express 5 + Hyper Elements SSR Service
│       ├── src/
│       │   ├── config/              # Constants and sample event/attendee data
│       │   ├── modules/event/       # In-memory event service and controller
│       │   ├── modules/attendee/    # Papa Parse ingestion, Zod validator, duplicate email filter
│       │   ├── modules/ticket/      # TicketData synthesizer with QR code generation
│       │   ├── modules/design/      # Design service and controller for template/branding state
│       │   ├── templates/designs/   # Design Registry & Templates:
│       │   │   ├── tech/            # TechEmail, TechPage, TechDocument, TechCanvas
│       │   │   ├── editorial/       # EditorialEmail, EditorialPage, EditorialDocument, EditorialCanvas
│       │   │   └── registry.ts      # Central Design Registry mapping IDs to metadata & templates
│       │   ├── services/rendering/  # Unified SSR service for all 4 output formats & designs
│       │   ├── routes/              # Express API routers (event, attendee, ticket, design, branding)
│       │   ├── middleware/          # Multer file upload & validation middleware
│       │   ├── cli/                 # CLI renderer and 28-assertion automated test suite
│       │   └── server.ts            # Express server (Port 3000)
│       ├── assets/fonts/            # Local TrueType fonts for offline rendering
│       ├── output/                  # Generated ticket artifacts
│       └── package.json
│
├── packages/
│   └── shared/           # Shared TypeScript domain contracts & Zod validation schemas
│       ├── src/
│       │   ├── types/               # EventInfo, AttendeeInfo, TicketData, DesignConfig, BrandingConfig
│       │   ├── schemas/             # eventSchema, attendeeSchema, designConfigSchema, ticketPreviewRequestSchema
│       │   └── index.ts
│       └── package.json
│
├── docs/                 # architecture.md and development.md
├── package.json          # Root workspace configuration
└── tsconfig.base.json    # Shared TypeScript compiler options
```

---

## 🚀 Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Servers (Concurrent Frontend + Backend)
```bash
npm run dev
```
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

Or run each independently:
```bash
npm run dev:backend   # Backend on port 3000
npm run dev:frontend  # Frontend on port 5173
```

### 3. Run Automated Verification Suite
Runs the 28-assertion test suite verifying Hyper Elements SSR across Tech and Editorial designs, magic bytes, event persistence, CSV validation, and branding customization:
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 🧪 Automated Verification Results

All 28 assertions passing:
- ✅ Design Registry contains both `tech` and `editorial` layouts
- ✅ Both designs have all 4 Hyper Elements templates registered
- ✅ Tech Design: Render EMAIL successfully
- ✅ Tech Design: Render PAGE successfully
- ✅ Tech Design: Render PDF successfully
- ✅ Tech Design: Render PNG successfully
- ✅ Editorial Design: Render EMAIL successfully
- ✅ Editorial Design: Render PAGE successfully
- ✅ Editorial Design: Render PDF successfully
- ✅ Editorial Design: Render PNG successfully
- ✅ Editorial PDF Magic Bytes validation (`%PDF-`)
- ✅ Editorial PNG Magic Bytes validation (`\x89PNG`)
- ✅ Editorial: Consistency of Attendee & Event data across formats
- ✅ Custom accent color propagates to Email & Web outputs
- ✅ Editorial handles missing seat number with "Open Seating"
- ✅ Editorial Long Name: Render EMAIL without breaking
- ✅ Editorial Long Name: Render PAGE without breaking
- ✅ Editorial Long Name: Render PDF without breaking
- ✅ Editorial Long Name: Render PNG without breaking
- ✅ Import valid CSV with column auto-detection
- ✅ Validate missing name and invalid email format in CSV
- ✅ Design configuration update and retrieval in memory
