# PassForge REST API Reference

This specification documents the REST API exposed by the PassForge Express backend service.

- **Base URL (Local Development Example):** `http://localhost:3000/api`
- **Content Type:** `application/json` (unless specified as `multipart/form-data` or binary streaming)

---

## 1. System & Health

### `GET /api/health`
Returns server operational status and uptime.

**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "PassForge API Server",
  "timestamp": "2026-11-26T10:00:00.000Z",
  "uptimeSeconds": 1420
}
```

---

## 2. Event Management

### `GET /api/events/current`
Fetches active event metadata.

**Response (200 OK):**
```json
{
  "success": true,
  "event": {
    "name": "Apex Global Summit 2027",
    "date": "15 February 2027",
    "time": "09:00 AM - 06:00 PM PST",
    "venue": "Grand Horizon Center",
    "location": "San Francisco, CA 94103",
    "organizer": "Apex Technology Directorate",
    "website": "https://apexsummit2027.example.com",
    "description": "Annual flagship technology summit."
  }
}
```

### `POST /api/events`
Updates the current event configuration.

**Request Body (`application/json`):**
```json
{
  "name": "Apex Global Summit 2027",
  "date": "15 February 2027",
  "venue": "Grand Horizon Center",
  "time": "09:00 AM PST",
  "organizer": "Apex Tech"
}
```

**Validation:**
- `name` (required string, 1-120 chars)
- `date` (required string)
- `venue` (required string)

**Response (200 OK):**
```json
{
  "success": true,
  "event": { ... }
}
```

---

## 3. Attendee Management & CSV Ingestion

### `GET /api/attendees`
Retrieves attendee roster with optional search and category filters.

**Query Parameters:**
- `search` (optional string): Case-insensitive match on name or email.
- `ticketType` (optional string): Filter by tier (`VIP`, `Speaker`, `General`, `Student`).

**Response (200 OK):**
```json
{
  "success": true,
  "attendees": [
    {
      "id": "att-001",
      "name": "Alex Morgan",
      "email": "alex.morgan@example.com",
      "ticketType": "VIP",
      "seat": "A-101"
    }
  ],
  "count": 1
}
```

### `POST /api/attendees/import`
Ingests a CSV file or raw CSV text with column mapping.

**Headers:** `Content-Type: multipart/form-data` or `application/json`

**Form Data / JSON Body:**
- `file`: Multipart CSV file upload (Max 5MB).
- `csv`: Raw CSV string (if sending JSON).
- `mapping` (optional JSON string): Column override mapping:
  ```json
  {
    "name": "Full Name",
    "email": "Work Email",
    "ticketType": "Access Tier",
    "seat": "Assigned Seat"
  }
  ```

**Response (200 OK):**
```json
{
  "success": true,
  "result": {
    "totalRows": 25,
    "validCount": 24,
    "invalidCount": 1,
    "skippedCount": 0,
    "attendees": [ ... ],
    "errors": [
      {
        "row": 14,
        "email": "malformed-email",
        "error": "Invalid email address format"
      }
    ],
    "detectedColumns": {
      "name": "Full Name",
      "email": "Email",
      "ticketType": "Ticket Type",
      "seat": "Seat"
    }
  }
}
```

### `POST /api/attendees/demo`
Loads the 12-attendee demo roster spanning all four tiers.

**Response (200 OK):**
```json
{
  "success": true,
  "attendees": [ ... ],
  "count": 12
}
```

### `POST /api/attendees/reset`
Resets the attendee roster back to the initial sample attendee.

**Response (200 OK):**
```json
{
  "success": true,
  "attendees": [ ... ],
  "count": 1
}
```

---

## 4. Design & Branding

### `GET /api/designs`
Returns all registered design templates and their supported capabilities.

**Response (200 OK):**
```json
{
  "success": true,
  "designs": [
    {
      "id": "tech",
      "name": "Cyber Tech",
      "description": "High-contrast dark-mode terminal layout.",
      "defaultAccent": "#06b6d4"
    },
    {
      "id": "editorial",
      "name": "Premium Editorial",
      "description": "Warm parchment typography with classical borders.",
      "defaultAccent": "#b45309"
    }
  ]
}
```

### `GET /api/designs/current`
Fetches the active design theme and Brand Kit customizations.

**Response (200 OK):**
```json
{
  "success": true,
  "config": {
    "designId": "tech",
    "branding": {
      "accentColor": "#06b6d4",
      "fontFamily": "Inter, sans-serif",
      "logoUrl": "data:image/png;base64,...",
      "watermark": {
        "enabled": true,
        "opacity": 0.08,
        "size": 40
      }
    }
  }
}
```

### `POST /api/designs/current`
Updates active design and branding settings.

**Request Body (`application/json`):**
```json
{
  "designId": "editorial",
  "branding": {
    "accentColor": "#991b1b",
    "fontFamily": "Georgia, serif",
    "watermark": {
      "enabled": true,
      "opacity": 0.10,
      "size": 45
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "config": { ... }
}
```

### `POST /api/branding/logo`
Uploads a custom event/sponsor logo.

**Headers:** `Content-Type: multipart/form-data`
- `logo`: Image file (PNG, SVG, or JPG; Max 5MB).

**Response (200 OK):**
```json
{
  "success": true,
  "logoUrl": "data:image/png;base64,...",
  "size": 45210
}
```

### `POST /api/branding/reset`
Restores default colors and font settings for the current design.

**Response (200 OK):**
```json
{
  "success": true,
  "branding": { ... }
}
```

---

## 5. Ticket Preview & Rendering

### `POST /api/tickets/preview`
Generates an immediate, real-time ticket preview for the specified format.

**Request Body (`application/json`):**
```json
{
  "format": "png",
  "attendeeId": "att-001",
  "designId": "tech",
  "branding": {
    "accentColor": "#06b6d4"
  }
}
```

**Supported `format` values:** `email`, `page`, `pdf`, `png`

**Response (200 OK):**
```json
{
  "success": true,
  "format": "png",
  "designId": "tech",
  "dataUrl": "data:image/png;base64,...",
  "renderTimeMs": 85,
  "dimensions": {
    "width": 1440,
    "height": 640
  }
}
```
*(For `email` and `page`, returns rendered `html` string; for `pdf`, returns `dataUrl` with `%PDF-` base64).*

### `GET /api/preview/:format`
Streams raw rendered ticket content directly for browser previewing (`?ticketId=...`).
- `format: email` → `Content-Type: text/html`
- `format: page` → `Content-Type: text/html`
- `format: pdf` → `Content-Type: application/pdf`
- `format: png` → `Content-Type: image/png`

### `GET /api/download/:format`
Triggers file attachment download with `Content-Disposition: attachment`.

---

## 6. Bulk Generation & ZIP Export

### `POST /api/bulk/generate`
Enqueues a background bulk generation job for selected attendees and formats.

**Request Body (`application/json`):**
```json
{
  "attendeeIds": ["att-001", "att-002", "att-003"],
  "formats": ["pdf", "png", "email"],
  "designId": "editorial"
}
```

**Validation:**
- `attendeeIds`: Array of at least 1 valid existing attendee ID.
- `formats`: Array of at least 1 valid format (`email`, `page`, `pdf`, `png`).

**Response (202 Accepted):**
```json
{
  "success": true,
  "jobId": "job_1795641234_abcde",
  "status": "QUEUED",
  "totalTasks": 9,
  "selectedAttendeeCount": 3,
  "selectedFormats": ["pdf", "png", "email"],
  "message": "Enqueued 9 ticket generation tasks across 3 attendees and 3 formats."
}
```

### `GET /api/bulk/:jobId`
Polls progress and status for an active or completed bulk job.

**Response (200 OK):**
```json
{
  "success": true,
  "jobId": "job_1795641234_abcde",
  "status": "PROCESSING",
  "totalTasks": 9,
  "completedTasks": 6,
  "failedTasks": 0,
  "pendingTasks": 3,
  "progressPercent": 67,
  "createdAt": "2026-11-26T10:00:00.000Z",
  "isTerminal": false,
  "tasks": [ ... ]
}
```

**Status Values:**
- `QUEUED`: Awaiting worker availability.
- `PROCESSING`: Workers actively rendering tasks.
- `COMPLETED`: All tasks finished successfully.
- `COMPLETED_WITH_ERRORS`: Completed with one or more task errors.
- `FAILED`: All tasks failed.
- `CANCELLED`: Aborted by organizer.

### `POST /api/bulk/:jobId/retry`
Retries only failed tasks from a completed or partially-failed job.

**Response (200 OK):**
```json
{
  "success": true,
  "jobId": "job_1795641234_abcde",
  "status": "PROCESSING",
  "pendingTasks": 2,
  "message": "Retrying 2 failed tasks."
}
```

### `POST /api/bulk/:jobId/cancel`
Terminates in-flight execution and marks pending tasks as failed.

**Response (200 OK):**
```json
{
  "success": true,
  "jobId": "job_1795641234_abcde",
  "status": "CANCELLED",
  "message": "Job cancelled by organizer"
}
```

### `GET /api/bulk/:jobId/download`
Streams a structured ZIP archive containing all completed ticket outputs and `manifest.json`.

**Response (200 OK):**
- **Header:** `Content-Type: application/zip`
- **Header:** `Content-Disposition: attachment; filename="passforge-tickets-[jobId].zip"`
- **Body:** Binary ZIP stream.
