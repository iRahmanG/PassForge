# PassForge — Milestone 1: Hyper Elements Rendering POC

> Bulk personalized event ticket generation application for the **Hyper Elements Template Challenge**.

---

## 🎯 Product Vision

PassForge allows event organizers to upload attendee data through CSV, select a ticket design, and generate personalized tickets in four formats:
1. **Email HTML** — Personalized confirmation email for attendees
2. **Responsive Web Ticket** — Mobile-friendly digital wallet pass
3. **Printable PDF** — Print-ready admission pass on standard A4 paper
4. **PNG Ticket** — Visual ticket badge image for social sharing and offline storage

**Scope for Milestone 1:** Before implementing CSV bulk uploads, authentication, or dashboards, this proof of concept proves that **Hyper Elements** reliably renders a personalized ticket in all four formats from a single typed ticket model.

---

## 🏛️ Hyper Elements Version & Exact APIs Used

- **Package:** `@hyper-elements/react` (`v0.5.2`)
- **Peer Dependencies:**
  - `@react-pdf/renderer` (`^4.9.0`) — Required by `@hyper-elements/react/pdf`
  - `satori` (`^0.33.5`) and `@resvg/resvg-js` (`^2.6.2`) — Required by `@hyper-elements/react/image`
  - `qrcode` (`^1.5.4`) — Fast QR code matrix generation

### Exact APIs Implemented:
| Format | Hyper Elements Root | Rendering Function | Module Path | Output |
|---|---|---|---|---|
| **Email** | `<Email width={600} previewText="..." />` | `render(element)` | `@hyper-elements/react` | Email-safe table-based HTML |
| **Page** | `<Page width={680} breakpoints={{ mobile: 560 }} />` | `render(element)` | `@hyper-elements/react` | Responsive Web HTML with mobile breakpoints |
| **Document** | `<Document size="A4" orientation="portrait" margin={32} />` | `renderPdf(element, options)` | `@hyper-elements/react/pdf` | Valid Binary PDF (`%PDF-`) |
| **Canvas** | `<Canvas width={1000} height={520} />` | `renderImage(element, options)` | `@hyper-elements/react/image` | Crisp 2x Retina PNG (`\x89PNG`) |

---

## 🎫 Sample Event & Attendee Data

- **Event:** KIET TechFest 2027
- **Date:** 15 February 2027 (09:00 AM - 06:00 PM IST)
- **Venue:** KIET Group of Institutions, Delhi-NCR, Ghaziabad, UP
- **Organizer:** KIET Technical Team
- **Attendee:** Maksud Rahman
- **Email:** `maksud@example.com`
- **Ticket Type:** VIP
- **Seat:** A-104
- **Ticket ID:** `KTF27-VIP-84920`
- **QR Code:** Generated dynamically encoding ticket identification URL

---

## 📂 Project Structure

```
PassForge/
├── assets/
│   └── fonts/
│       ├── arial.ttf            # Local TrueType font for Canvas/PDF rendering
│       └── arialbd.ttf          # Local Bold TrueType font
├── output/                      # Generated ticket artifacts
│   ├── ticket-KTF27-VIP-84920-email.html
│   ├── ticket-KTF27-VIP-84920-web.html
│   ├── ticket-KTF27-VIP-84920.pdf
│   └── ticket-KTF27-VIP-84920.png
├── src/
│   ├── cli/
│   │   ├── renderTest.ts        # CLI script to generate all 4 formats
│   │   └── verifyAll.ts         # 19-assertion automated verification suite
│   ├── data/
│   │   └── sampleTicket.ts      # Sample event, attendee, and QR generator
│   ├── services/
│   │   └── ticketRenderer.ts    # Unified Hyper Elements SSR rendering service
│   ├── templates/
│   │   ├── theme.ts             # Shared Hyper Elements theme
│   │   ├── TicketCanvas.tsx     # <Canvas> template for PNG badge
│   │   ├── TicketDocument.tsx   # <Document> template for printable PDF
│   │   ├── TicketEmail.tsx      # <Email> template for confirmation email
│   │   └── TicketPage.tsx       # <Page> template for responsive web pass
│   ├── types/
│   │   └── ticket.ts            # Shared TypeScript ticket data contract
│   └── server.ts                # Express development preview server
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 How to Run

### 1. Run Automated Verification Suite
Runs the 19 test assertions covering generation, byte signatures, attendee data consistency, and long name layout resilience:
```bash
npm test
```

### 2. Generate Files via CLI
Generates all 4 ticket formats into the `output/` directory:
```bash
npm run render
```

### 3. Start the Interactive Preview Server
Starts the interactive preview UI at `http://localhost:3000`:
```bash
npm run dev
# or
npm start
```

---

## 📊 Verification Results

| Output Format | Output File | Size | Render Time | Status |
|---|---|---|---|---|
| **Email HTML** | `output/ticket-KTF27-VIP-84920-email.html` | ~18.2 KB | 23 ms | ✅ Verified |
| **Responsive Web** | `output/ticket-KTF27-VIP-84920-web.html` | ~9.9 KB | 8 ms | ✅ Verified |
| **Printable PDF** | `output/ticket-KTF27-VIP-84920.pdf` | ~10.9 KB | 78 ms | ✅ Verified |
| **PNG Ticket** | `output/ticket-KTF27-VIP-84920.png` | ~125.7 KB | 195 ms | ✅ Verified |

### Stress Testing & Design Resilience:
- Tested with extended attendee names (`Prof. Dr. Alexandrina Montgomery-Fitzgerald III`) and long seat identifiers (`ZONE-A-ROW-04-SEAT-112`).
- Flex and column wrapping constraints preserve visual hierarchy without layout overflow.
- QR code is rendered both as an inline base64 data URI for HTML/Page formats and as raw PNG binary buffers for Satori Canvas and React-PDF Document pipelines.
