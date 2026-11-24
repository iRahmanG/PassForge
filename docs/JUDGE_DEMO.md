# PassForge — Judge Demonstration Guide

> **A demo-first personalized event ticket generation platform powered by Hyper Elements SSR.**

---

## 1. Product Overview

**PassForge** turns event rosters into beautifully personalized event tickets across four canonical delivery formats simultaneously:
1. **Email HTML**: Self-contained, responsive invitation markup designed for email clients.
2. **Web Page HTML**: Interactive digital pass with wallet actions and responsive viewport bezels.
3. **Printable PDF**: High-precision vector admission ticket formatted for standard physical printing.
4. **High-Res PNG**: 2000×1040 pixel badge graphic suitable for social sharing and mobile displays.

PassForge is engineered with a **zero-friction, demo-first architecture**: no mandatory database, no accounts, and no authentication. A judge can launch it, load realistic attendee data with one click, explore two distinct design systems, customize branding, and export an organized, zero-PII batch ZIP archive in seconds.

---

## 2. Launch Instructions (Quick Start)

Run these commands from the repository root:

```bash
# 1. Install dependencies across monorepo
npm install

# 2. Compile frontend client production bundle
npm run build

# 3. Start unified backend server (serves API and production client on port 3000)
npm start
```

Open your browser to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 3. Two-Minute Judge Demonstration Script

| Time | Goal | Action in UI | Spoken Demonstration Beat |
|---|---|---|---|
| **0:00 - 0:20** | **First Impression** | Open `http://localhost:3000`. Click **"Open Studio"** in the top navigation. | *"PassForge is a ticket compilation studio. When organizers host conferences or galas, generating personalized tickets across email, web, PDF, and badges is tedious. PassForge does all four in a single engine."* |
| **0:20 - 0:45** | **1-Click Demo Data** | Click **"Load Demo Event & Attendees"** in the Judge Quick Guide banner at the top of the Studio. | *"Judges don't need to prepare a CSV. With one click, we load a flagship event—KIET TechFest 2027—and 12 personalized attendees spanning VIP, Speaker, Student, and General tiers with seat assignments."* |
| **0:45 - 1:15** | **Explore Designs & Formats** | 1. In the central canvas, toggle the 4 format tabs: **Web Page**, **Email**, **PDF Document**, and **PNG Image**.<br>2. In the Left Gallery, switch from **Cyber Tech** to **Premium Editorial**.<br>3. Open the Brand Kit on the right and click the **"Premium Gala"** preset. | *"Notice how the design responds instantly. Both designs—Tech and Editorial—are rendered natively via Hyper Elements. The tier badges adapt dynamically: VIP gets crimson gold, Speaker gets purple, Student gets cyan."* |
| **1:15 - 1:45** | **Batch Export** | In the top toolbar, click **Export** → **Batch Export (ZIP)**. Keep all 4 formats selected. Click **"Generate 48 Tickets"**. | *"Now we initiate bulk generation. PassForge's controlled worker pool compiles 48 tickets (12 attendees × 4 formats) with real-time task progress, zero-PII isolation, and automatic retry protection."* |
| **1:45 - 2:00** | **Inspect Archive** | Click **"Download ZIP Archive (48 Tickets)"**. Extract the downloaded file. | *"The completed results view previews the exact directory tree. Inside the ZIP, outputs are strictly partitioned into `email/`, `page/`, `pdf/`, `png/`, plus a clean `manifest.json` with zero attendee PII."* |

---

## 4. Key Feature Walkthrough

### A. Template Systems
- **Cyber Tech & Hackathon (`tech`)**: Dark-mode aesthetic (`#0A0E17`), electric cyan accent, barcode/QR badge elements, monospaced typography, and technical metadata.
- **Premium Editorial & Gala (`editorial`)**: High-fashion serif typography (`Playfair Display`), warm ivory paper palette (`#FAF8F5`), refined borders, and prestige event badging.

### B. Four Canonical Output Formats
| Format ID | Canonical Name | Output Extension | Typical Delivery Scenario |
|---|---|---|---|
| `email` | **Email Invitation** | `.html` | Email confirmation, calendar invite attachment |
| `page` | **Digital Web Pass** | `.html` | Mobile ticket URL with Apple/Google Wallet actions |
| `pdf` | **Printable Ticket** | `.pdf` | A4/Letter vector PDF document for physical printout |
| `png` | **Badge Image** | `.png` | 2000×1040 social share card, badge graphic |

### C. ZIP Archive Structure
```text
passforge-tickets-kiet-techfest-2027.zip
├── manifest.json       <-- Comprehensive export manifest (0 PII, filenames & sizes only)
├── email/              <-- 12 standalone HTML email templates
├── page/               <-- 12 responsive web passes
├── pdf/                <-- 12 vector printable PDF documents
└── png/                <-- 12 high-resolution 2000×1040 PNG badges
```

> **Privacy Guarantee**: `manifest.json` contains event details, design metadata, timestamp, and a file registry with checksums. Attendee IDs, email addresses, and phone numbers are strictly omitted.

---

## 5. Security & Public Demo Guardrails

PassForge is reinforced for public demonstration reliability:
1. **Rate Limiting**:
   - Bulk job creation: 20 batches / minute (`POST /api/bulk/generate`).
   - CSV upload: 30 imports / minute (`POST /api/attendees/import`).
   - General API: 300 requests / minute.
   - **Status Polling Exemption**: Polling (`GET /api/bulk/:jobId`) is exempted so real-time 600ms progress monitoring never stutters or triggers HTTP 429.
   - **Protected Downloads**: ZIP downloads are protected under the general rate limiter to prevent denial-of-service downloads.
2. **Resource Caps**:
   - CSV uploads are strictly capped at **500 attendees** and **5 MB**.
3. **Artifact Exposure Protection**:
   - Direct browsing of `/output` is blocked with an explicit 404 handler to prevent unauthorized static file scraping.
4. **Safe Retention & Cleanup**:
   - Terminal jobs are automatically purged after 2 hours.
   - Active client downloads are protected from premature file deletion.

---

## 6. Honest Limitations & Architecture Notes

1. **In-Memory Demonstration State**: All event metadata, attendee rosters, and bulk jobs live in server memory. Restarting the backend server resets the state to default initial data.
2. **No User Accounts or Authentication**: Intentionally designed without login barriers so judges can evaluate core ticket rendering and export immediately.
3. **Worker Concurrency**: Bulk generation concurrency defaults to 3 workers on Node.js to balance parallel compilation throughput with memory stability.
