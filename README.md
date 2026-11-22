# PassForge — Milestone 2: Architecture Separation & CSV Import

> Bulk personalized event ticket generation application for the **Hyper Elements Template Challenge**.

---

## 🎯 Project Overview

PassForge enables event organizers to configure an event, upload attendee rosters via CSV with flexible column mapping, and generate high-fidelity personalized tickets in four distinct formats powered by **Hyper Elements**:

1. **Personalized Confirmation Email** (`<Email>`)
2. **Responsive Digital Web Ticket** (`<Page>`)
3. **Printable Admission Pass PDF** (`<Document>`)
4. **Visual Ticket Badge PNG** (`<Canvas>`)

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
│   │   │   ├── features/tickets/    # 4-format ticket preview modal & format cards
│   │   │   ├── features/exports/    # Export pipeline readiness card
│   │   │   ├── hooks/               # useEvent, useAttendees, useTicketRender
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
│       │   ├── templates/           # Hyper Elements templates (Email, Page, Document, Canvas)
│       │   ├── services/rendering/  # Unified SSR service for all 4 output formats
│       │   ├── routes/              # Express API routers
│       │   ├── middleware/          # Multer file upload & validation middleware
│       │   ├── cli/                 # CLI renderer and 25-assertion automated test suite
│       │   └── server.ts            # Express server (Port 3000)
│       ├── assets/fonts/            # Local TrueType fonts for offline rendering
│       ├── output/                  # Generated ticket artifacts
│       └── package.json
│
├── packages/
│   └── shared/           # Shared TypeScript domain contracts & Zod validation schemas
│       ├── src/
│       │   ├── types/               # EventInfo, AttendeeInfo, TicketData, CsvImportResult
│       │   ├── schemas/             # eventSchema, attendeeSchema, csvColumnMappingSchema
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
Runs the 25-assertion test suite verifying Hyper Elements SSR, magic bytes, event persistence, and CSV validation:
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 📊 Verification Test Results

```
===============================================================
   PassForge Milestone 2: Automated Verification Suite
===============================================================

✅ PASS | Render EMAIL successfully
✅ PASS | Render PAGE successfully
✅ PASS | Render PDF successfully
✅ PASS | Render PNG successfully
✅ PASS | PDF Magic Bytes validation (%PDF-)
✅ PASS | PNG Magic Bytes validation (\x89PNG)
✅ PASS | Field "Maksud Rahman" present in Email & Web HTML
✅ PASS | Field "KIET TechFest 2027" present in Email & Web HTML
✅ PASS | Field "VIP" present in Email & Web HTML
✅ PASS | Field "A-104" present in Email & Web HTML
✅ PASS | Field "15 February 2027" present in Email & Web HTML
✅ PASS | Field "KIET Group of Institutions" present in Email & Web HTML
✅ PASS | Field "KTF27-VIP-84920" present in Email & Web HTML
✅ PASS | QR Code Data URL format
✅ PASS | QR Code Raw Buffer PNG signature
✅ PASS | Long Name: Render EMAIL without breaking
✅ PASS | Long Name: Render PAGE without breaking
✅ PASS | Long Name: Render PDF without breaking
✅ PASS | Long Name: Render PNG without breaking
✅ PASS | Event update validation and persistence
✅ PASS | Import valid CSV with column auto-detection (3/3 attendees)
✅ PASS | Validate missing name and invalid email format
✅ PASS | Detect duplicate email in CSV batch
✅ PASS | Skip empty lines and whitespace rows gracefully
✅ PASS | Custom CSV column mapping
===============================================================
🎉 ALL 25 ASSERTIONS PASSED! Monorepo & CSV Import verified.
===============================================================
```

---

## 📑 CSV Import Capabilities

- **Drag-and-Drop & File Picker:** Supports `.csv` and `.txt` files up to 5MB.
- **Header Auto-Detection:** Automatically maps typical column names (e.g. `Full Name`, `Email Address`, `Ticket Type`, `Seat Number`).
- **Interactive Mapping:** UI enables selecting custom columns when CSV headers differ from defaults.
- **Validation:**
  - Name: Required string.
  - Email: Required RFC 5322 format; duplicate emails in batch are flagged.
  - Ticket Category: Required (defaults to `General` if omitted).
  - Seat: Optional (defaults to `General Admission` or `Unassigned`).
  - Empty rows are safely skipped.
- **Detailed Error Reporting:** Shows row numbers and specific field validation errors.
