import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { createTicketData } from './data/sampleTicket.js';
import { ticketRenderer } from './services/ticketRenderer.js';
import { runFullVerification } from './cli/verifyAll.js';
import { OutputFormat } from './types/ticket.js';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const outputDir = path.resolve('output');

app.use(cors());
app.use(express.json());
app.use('/output', express.static(outputDir));

// State cache
let currentTicketData: any = null;
let lastRenderResults: Record<string, any> = {};

async function initData() {
  currentTicketData = await createTicketData();
  // Pre-render once so preview is ready on first load
  lastRenderResults = await ticketRenderer.renderAll(currentTicketData, outputDir);
}

// API: Get ticket metadata & status
app.get('/api/ticket-data', async (_req: Request, res: Response) => {
  if (!currentTicketData) await initData();
  res.json({
    ticket: currentTicketData,
    results: lastRenderResults,
  });
});

// API: Trigger generation for specific format or all
app.post('/api/generate/:format', async (req: Request, res: Response) => {
  const format = req.params.format as OutputFormat | 'all';
  if (!currentTicketData) await initData();

  try {
    if (format === 'all') {
      lastRenderResults = await ticketRenderer.renderAll(currentTicketData, outputDir);
      return res.json({ success: true, results: lastRenderResults });
    }

    if (format === 'email') {
      const start = performance.now();
      const { html, diagnostics } = await ticketRenderer.renderEmail(currentTicketData);
      const filePath = path.join(outputDir, `ticket-${currentTicketData.ticketId}-email.html`);
      fs.writeFileSync(filePath, html, 'utf-8');
      lastRenderResults.email = {
        format: 'email',
        success: true,
        outputPath: filePath,
        sizeBytes: Buffer.byteLength(html),
        renderTimeMs: Math.round(performance.now() - start),
        diagnostics,
      };
      return res.json({ success: true, result: lastRenderResults.email });
    }

    if (format === 'page') {
      const start = performance.now();
      const { html, diagnostics } = await ticketRenderer.renderPage(currentTicketData);
      const filePath = path.join(outputDir, `ticket-${currentTicketData.ticketId}-web.html`);
      fs.writeFileSync(filePath, html, 'utf-8');
      lastRenderResults.page = {
        format: 'page',
        success: true,
        outputPath: filePath,
        sizeBytes: Buffer.byteLength(html),
        renderTimeMs: Math.round(performance.now() - start),
        diagnostics,
      };
      return res.json({ success: true, result: lastRenderResults.page });
    }

    if (format === 'pdf') {
      const start = performance.now();
      const { pdf, diagnostics } = await ticketRenderer.renderPdf(currentTicketData);
      const filePath = path.join(outputDir, `ticket-${currentTicketData.ticketId}.pdf`);
      fs.writeFileSync(filePath, Buffer.from(pdf));
      lastRenderResults.pdf = {
        format: 'pdf',
        success: true,
        outputPath: filePath,
        sizeBytes: pdf.length,
        renderTimeMs: Math.round(performance.now() - start),
        diagnostics,
      };
      return res.json({ success: true, result: lastRenderResults.pdf });
    }

    if (format === 'png') {
      const start = performance.now();
      const { image, width, height, diagnostics } = await ticketRenderer.renderCanvas(currentTicketData);
      const filePath = path.join(outputDir, `ticket-${currentTicketData.ticketId}.png`);
      fs.writeFileSync(filePath, Buffer.from(image));
      lastRenderResults.png = {
        format: 'png',
        success: true,
        outputPath: filePath,
        sizeBytes: image.length,
        renderTimeMs: Math.round(performance.now() - start),
        diagnostics,
      };
      return res.json({ success: true, result: lastRenderResults.png });
    }

    return res.status(400).json({ error: `Unknown format: ${format}` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Preview format
app.get('/api/preview/:format', async (req: Request, res: Response) => {
  const format = req.params.format;
  if (!currentTicketData) await initData();

  if (format === 'email') {
    const filePath = path.join(outputDir, `ticket-${currentTicketData.ticketId}-email.html`);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.sendFile(filePath);
    }
  }

  if (format === 'page') {
    const filePath = path.join(outputDir, `ticket-${currentTicketData.ticketId}-web.html`);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.sendFile(filePath);
    }
  }

  if (format === 'pdf') {
    const filePath = path.join(outputDir, `ticket-${currentTicketData.ticketId}.pdf`);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/pdf');
      return res.sendFile(filePath);
    }
  }

  if (format === 'png') {
    const filePath = path.join(outputDir, `ticket-${currentTicketData.ticketId}.png`);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'image/png');
      return res.sendFile(filePath);
    }
  }

  return res.status(404).send('File not found. Generate it first.');
});

// API: Download format
app.get('/api/download/:format', async (req: Request, res: Response) => {
  const format = req.params.format;
  if (!currentTicketData) await initData();

  const fileMap: Record<string, { name: string; type: string }> = {
    email: { name: `ticket-${currentTicketData.ticketId}-email.html`, type: 'text/html' },
    page: { name: `ticket-${currentTicketData.ticketId}-web.html`, type: 'text/html' },
    pdf: { name: `ticket-${currentTicketData.ticketId}.pdf`, type: 'application/pdf' },
    png: { name: `ticket-${currentTicketData.ticketId}.png`, type: 'image/png' },
  };

  const fileInfo = fileMap[format];
  if (!fileInfo) return res.status(400).send('Invalid format');

  const filePath = path.join(outputDir, fileInfo.name);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File has not been generated yet.');
  }

  res.download(filePath, fileInfo.name);
});

// API: Run test for long attendee name
app.post('/api/test-long-name', async (_req: Request, res: Response) => {
  try {
    const longTicket = await createTicketData(
      {
        name: 'Prof. Dr. Alexandrina Montgomery-Fitzgerald III',
        email: 'alexandrina.montgomery.fitzgerald.iii@longdomainexample.org',
        ticketType: 'VIP DELEGATE',
        seat: 'SECTION-A-ROW-02-SEAT-104',
      },
      'KTF27-VIP-LONGNAME'
    );
    const results = await ticketRenderer.renderAll(longTicket, outputDir);
    return res.json({ success: true, results, ticket: longTicket });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Run automated verification
app.get('/api/verify', async (_req: Request, res: Response) => {
  try {
    const suiteResult = await runFullVerification();
    res.json(suiteResult);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Front-end preview interface
app.get('/', async (_req: Request, res: Response) => {
  if (!currentTicketData) await initData();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PassForge — Hyper Elements Rendering POC (Milestone 1)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --card-border: #1f293d;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --accent: #38bdf8;
      --gold: #f59e0b;
      --success: #10b981;
      --danger: #ef4444;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: rgba(17, 24, 39, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--card-border);
      padding: 16px 32px;
      position: sticky;
      top: 0;
      z-index: 50;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      background: linear-gradient(135deg, #6366f1, #38bdf8);
      color: white;
      font-weight: 800;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 14px;
      letter-spacing: 1px;
    }
    .logo-title {
      font-weight: 800;
      font-size: 18px;
      letter-spacing: -0.5px;
    }
    .header-badge {
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #a5b4fc;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    main {
      flex: 1;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 32px;
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 32px;
    }
    @media (max-width: 1024px) {
      main { grid-template-columns: 1fr; }
    }
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 24px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--text-muted);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 13px;
    }
    .meta-label { color: var(--text-muted); }
    .meta-value { font-weight: 600; color: #ffffff; text-align: right; }
    .badge-vip {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: var(--gold);
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
    }
    .gen-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .gen-btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
    }
    .gen-btn:hover {
      background: #27354a;
      border-color: #475569;
      transform: translateY(-1px);
    }
    .gen-btn.primary {
      background: linear-gradient(135deg, var(--primary), #4338ca);
      border-color: #4f46e5;
    }
    .gen-btn.primary:hover {
      background: linear-gradient(135deg, #4f46e5, #3730a3);
    }
    .status-pill {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
    }
    .status-pill.success {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }
    .status-pill.idle {
      background: rgba(148, 163, 184, 0.1);
      color: #94a3b8;
    }
    .status-pill.loading {
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.4);
    }
    .preview-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .tabs {
      display: flex;
      background: #0f172a;
      padding: 4px;
      border-radius: 10px;
      border: 1px solid var(--card-border);
      gap: 4px;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-btn.active {
      background: #1e293b;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .preview-frame-container {
      background: #0b0f19;
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 24px;
      min-height: 600px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    iframe {
      width: 100%;
      height: 700px;
      border: none;
      border-radius: 12px;
      background: #0a0e17;
    }
    .image-preview {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      border: 1px solid #1f293d;
    }
    .actions-bar {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      width: 100%;
      justify-content: flex-end;
    }
    .action-btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: #e2e8f0;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .action-btn:hover {
      background: #27354a;
    }
    .stats-box {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #94a3b8;
      background: #0b1120;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #1e293b;
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
  </style>
</head>
<body>
  <header>
    <div class="logo">
      <div class="logo-badge">PASSFORGE</div>
      <div class="logo-title">Milestone 1 — Hyper Elements Rendering POC</div>
    </div>
    <div class="header-badge">@hyper-elements/react v0.5.2</div>
  </header>

  <main>
    <div class="sidebar">
      <!-- Event Card -->
      <div class="card">
        <div class="card-title">
          <span>Target Event</span>
          <span style="color: #38bdf8; font-size: 11px;">KIET</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Event:</span>
          <span class="meta-value">${currentTicketData.event.name}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Date:</span>
          <span class="meta-value">${currentTicketData.event.date}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Venue:</span>
          <span class="meta-value">${currentTicketData.event.venue}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Organizer:</span>
          <span class="meta-value">${currentTicketData.event.organizer}</span>
        </div>
      </div>

      <!-- Attendee Card -->
      <div class="card">
        <div class="card-title">
          <span>Attendee Data</span>
          <span class="badge-vip">${currentTicketData.attendee.ticketType} PASS</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Name:</span>
          <span class="meta-value">${currentTicketData.attendee.name}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Email:</span>
          <span class="meta-value">${currentTicketData.attendee.email}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Seat:</span>
          <span class="meta-value" style="color: #38bdf8;">${currentTicketData.attendee.seat}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Ticket ID:</span>
          <span class="meta-value" style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">${currentTicketData.ticketId}</span>
        </div>
      </div>

      <!-- Generation Controls -->
      <div class="card">
        <div class="card-title">Generation Controls</div>
        <div class="gen-grid">
          <button class="gen-btn primary" onclick="generateFormat('all')">
            <span>⚡ Generate All 4 Formats</span>
            <span class="status-pill success" id="status-all">READY</span>
          </button>
          <button class="gen-btn" onclick="generateFormat('email')">
            <span>📧 Email HTML (&lt;Email&gt;)</span>
            <span class="status-pill ${lastRenderResults.email?.success ? 'success' : 'idle'}" id="status-email">
              ${lastRenderResults.email?.success ? 'DONE (' + lastRenderResults.email.renderTimeMs + 'ms)' : 'GENERATE'}
            </span>
          </button>
          <button class="gen-btn" onclick="generateFormat('page')">
            <span>🌐 Web Ticket (&lt;Page&gt;)</span>
            <span class="status-pill ${lastRenderResults.page?.success ? 'success' : 'idle'}" id="status-page">
              ${lastRenderResults.page?.success ? 'DONE (' + lastRenderResults.page.renderTimeMs + 'ms)' : 'GENERATE'}
            </span>
          </button>
          <button class="gen-btn" onclick="generateFormat('pdf')">
            <span>📄 Printable PDF (&lt;Document&gt;)</span>
            <span class="status-pill ${lastRenderResults.pdf?.success ? 'success' : 'idle'}" id="status-pdf">
              ${lastRenderResults.pdf?.success ? 'DONE (' + lastRenderResults.pdf.renderTimeMs + 'ms)' : 'GENERATE'}
            </span>
          </button>
          <button class="gen-btn" onclick="generateFormat('png')">
            <span>🖼️ Ticket PNG (&lt;Canvas&gt;)</span>
            <span class="status-pill ${lastRenderResults.png?.success ? 'success' : 'idle'}" id="status-png">
              ${lastRenderResults.png?.success ? 'DONE (' + lastRenderResults.png.renderTimeMs + 'ms)' : 'GENERATE'}
            </span>
          </button>
        </div>

        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--card-border);">
          <button class="gen-btn" style="width: 100%; border-color: #6366f1;" onclick="testLongName()">
            <span>🧪 Test Long Attendee Name</span>
            <span style="font-size: 11px; color: #a5b4fc;">Stress Test</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Area -->
    <div class="preview-section">
      <div class="preview-header">
        <div class="tabs">
          <button class="tab-btn active" id="tab-png" onclick="switchTab('png')">🖼️ PNG Ticket (Canvas)</button>
          <button class="tab-btn" id="tab-page" onclick="switchTab('page')">🌐 Responsive Web (Page)</button>
          <button class="tab-btn" id="tab-email" onclick="switchTab('email')">📧 Email HTML (Email)</button>
          <button class="tab-btn" id="tab-pdf" onclick="switchTab('pdf')">📄 Printable PDF (Document)</button>
        </div>
        <div class="actions-bar" id="actions-bar">
          <a class="action-btn" id="btn-open-raw" href="/api/preview/png" target="_blank">↗ Open in Tab</a>
          <a class="action-btn" id="btn-download" href="/api/download/png">⬇ Download PNG</a>
        </div>
      </div>

      <div class="preview-frame-container" id="preview-container">
        <!-- Rendered dynamically -->
        <img src="/api/preview/png?t=${Date.now()}" class="image-preview" id="png-image" alt="Ticket PNG Preview" />
      </div>

      <div class="stats-box" id="stats-display">
        <span>Format: <b id="stat-format">Canvas (PNG)</b></span>
        <span>Resolution: <b id="stat-res">2000 x 1040 (2x Retina)</b></span>
        <span>File Size: <b id="stat-size">${lastRenderResults.png ? (lastRenderResults.png.sizeBytes / 1024).toFixed(1) + ' KB' : 'N/A'}</b></span>
        <span>Render Time: <b id="stat-time">${lastRenderResults.png?.renderTimeMs || 0} ms</b></span>
        <span>Engine: <b>Hyper Elements SSR</b></span>
      </div>
    </div>
  </main>

  <script>
    let activeTab = 'png';

    function switchTab(format) {
      activeTab = format;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('tab-' + format).classList.add('active');

      const container = document.getElementById('preview-container');
      const openBtn = document.getElementById('btn-open-raw');
      const dlBtn = document.getElementById('btn-download');
      const statFormat = document.getElementById('stat-format');
      const statSize = document.getElementById('stat-size');
      const statTime = document.getElementById('stat-time');
      const statRes = document.getElementById('stat-res');

      openBtn.href = '/api/preview/' + format;
      dlBtn.href = '/api/download/' + format;
      dlBtn.innerText = '⬇ Download ' + format.toUpperCase();

      const timestamp = Date.now();

      if (format === 'png') {
        statFormat.innerText = 'Canvas (PNG Ticket)';
        statRes.innerText = '2000 x 1040 (2x Retina)';
        container.innerHTML = '<img src="/api/preview/png?t=' + timestamp + '" class="image-preview" alt="Ticket PNG Preview" />';
      } else if (format === 'page') {
        statFormat.innerText = 'Page (Responsive Web Ticket)';
        statRes.innerText = 'Responsive (Desktop / Mobile Breakpoints)';
        container.innerHTML = '<iframe src="/api/preview/page?t=' + timestamp + '"></iframe>';
      } else if (format === 'email') {
        statFormat.innerText = 'Email (Personalized HTML)';
        statRes.innerText = '600px Max-width, Email client safe';
        container.innerHTML = '<iframe src="/api/preview/email?t=' + timestamp + '"></iframe>';
      } else if (format === 'pdf') {
        statFormat.innerText = 'Document (Printable A4 PDF)';
        statRes.innerText = 'ISO A4 (Portrait, 32px Insets)';
        container.innerHTML = '<iframe src="/api/preview/pdf?t=' + timestamp + '#toolbar=0"></iframe>';
      }

      fetchStatus();
    }

    async function generateFormat(format) {
      const btn = document.getElementById('status-' + format);
      if (btn) {
        btn.className = 'status-pill loading';
        btn.innerText = 'RENDERING...';
      }

      try {
        const res = await fetch('/api/generate/' + format, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          if (format === 'all') {
            ['email', 'page', 'pdf', 'png'].forEach(f => {
              const pill = document.getElementById('status-' + f);
              if (pill && data.results[f]) {
                pill.className = 'status-pill success';
                pill.innerText = 'DONE (' + data.results[f].renderTimeMs + 'ms)';
              }
            });
            document.getElementById('status-all').innerText = 'UPDATED';
          } else {
            btn.className = 'status-pill success';
            btn.innerText = 'DONE (' + data.result.renderTimeMs + 'ms)';
          }
          switchTab(activeTab);
        } else {
          alert('Rendering error: ' + data.error);
        }
      } catch (e) {
        alert('Request failed: ' + e.message);
      }
    }

    async function testLongName() {
      if (!confirm('Render all 4 formats with a stress-test long attendee name?')) return;
      try {
        const res = await fetch('/api/test-long-name', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          alert('Long attendee name rendered successfully across all 4 formats! Reloading preview.');
          switchTab(activeTab);
        }
      } catch (e) {
        alert('Test failed: ' + e.message);
      }
    }

    async function fetchStatus() {
      try {
        const res = await fetch('/api/ticket-data');
        const data = await res.json();
        const curResult = data.results[activeTab];
        if (curResult) {
          document.getElementById('stat-size').innerText = (curResult.sizeBytes / 1024).toFixed(1) + ' KB';
          document.getElementById('stat-time').innerText = curResult.renderTimeMs + ' ms';
        }
      } catch (e) {}
    }
  </script>
</body>
</html>`;

  res.send(html);
});

initData().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 PassForge POC Server is running at http://localhost:${PORT}`);
  });
});
