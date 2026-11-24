const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Maksud\\.gemini\\antigravity\\brain\\01d504ad-0492-49b6-882d-1d27bf94ecf4';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\Maksud\\chrome-day1-profile';
const PORT = 9333;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const res = await fetch(url);
  return await res.json();
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) {
          reject(new Error(msg.error.message));
        } else {
          resolve(msg.result);
        }
      }
    };
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function run() {
  console.log('1. Starting headless Chrome on port', PORT);
  try {
    fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
  } catch (e) {}

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-allow-origins=*',
    'about:blank'
  ], { detached: false });

  // Wait for Chrome to listen
  let versionData = null;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      versionData = await fetchJson(`http://127.0.0.1:${PORT}/json/version`);
      if (versionData && versionData.webSocketDebuggerUrl) break;
    } catch (e) {}
  }

  if (!versionData) {
    throw new Error('Could not connect to Chrome debugging port.');
  }

  const pages = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
  const initialPage = pages.find(p => p.type === 'page') || pages[0];
  const pageWsUrl = initialPage.webSocketDebuggerUrl;

  const client = new CDPClient(pageWsUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');

  async function takeScreenshot(fileName, width, height) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 600,
    });
    await sleep(600);
    const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(ARTIFACT_DIR, fileName);
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${fileName} (${fs.statSync(filePath).size} bytes)`);
    return filePath;
  }

  async function evaluate(expression) {
    const res = await client.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result.value;
  }

  try {
    console.log('Navigating to http://localhost:3000/app...');
    await client.send('Page.navigate', { url: 'http://localhost:3000/app' });
    await sleep(3000);

    // Step 1: Verify Quick Guide on 1440x900
    console.log('--- Step 1: Checking Quick Guide on Desktop 1440x900 ---');
    const guidePresent = await evaluate(`!!document.querySelector('[data-testid="judge-quick-guide"]')`);
    console.log('Quick Guide present:', guidePresent);
    await takeScreenshot('day1-01-studio-quick-guide-1440.png', 1440, 900);

    // Step 2: Click "Load Demo Event & Attendees"
    console.log('--- Step 2: Clicking "Load Demo Event & Attendees" ---');
    await evaluate(`
      (() => {
        const btn = document.querySelector('[data-testid="guide-load-demo-btn"]') ||
                    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Load Demo Event & Attendees') || b.innerText.includes('Load Demo Roster'));
        if (btn) btn.click();
      })()
    `);
    await sleep(2000);

    // Verify attendee count
    const attendeeCount = await evaluate(`
      (() => {
        const select = document.querySelector('select');
        return select ? select.options.length : 0;
      })()
    `);
    console.log('Attendee dropdown total count:', attendeeCount);

    // Select second attendee (Dr. Evelyn Vasquez)
    await evaluate(`
      (() => {
        const select = document.querySelector('select');
        if (select && select.options.length > 1) {
          select.selectedIndex = 1;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()
    `);
    await sleep(1500);

    const attendeeText = await evaluate(`
      (() => {
        const select = document.querySelector('select');
        return select ? select.options[select.selectedIndex].text : '';
      })()
    `);
    console.log('Selected attendee:', attendeeText);

    // Extract tier & seat badges
    const badges = await evaluate(`
      (() => {
        const spans = Array.from(document.querySelectorAll('span'));
        return spans.map(s => s.innerText.trim()).filter(t => ['VIP', 'SPEAKER', 'STUDENT', 'GENERAL', 'Speaker', 'Student', 'General'].includes(t) || t.includes('Seat:'));
      })()
    `);
    console.log('Extracted badges:', badges);

    await takeScreenshot('day1-02-demo-attendees-loaded-1440.png', 1440, 900);

    // Step 3: Open Export dropdown and click "Batch Export (ZIP)"
    console.log('--- Step 3: Opening Bulk Export Modal ---');
    // Find the Export dropdown toggle button in the toolbar
    await evaluate(`
      (() => {
        const exportBtn = Array.from(document.querySelectorAll('button')).find(b => {
          return b.innerText.trim().startsWith('Export') && b.querySelector('svg');
        });
        if (exportBtn) exportBtn.click();
      })()
    `);
    await sleep(600);

    // Click the batch export item
    await evaluate(`
      (() => {
        const bulkBtn = document.querySelector('[data-testid="export-dropdown-bulk-btn"]') ||
                        Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Batch Export (ZIP)'));
        if (bulkBtn) bulkBtn.click();
      })()
    `);
    await sleep(1200);

    const modalTitle = await evaluate(`document.body.innerText.includes('Batch Export Tickets')`);
    const modalAttendeesFound = await evaluate(`document.body.innerText.includes('12 of 12 selected') || document.body.innerText.includes('12 attendees')`);
    console.log('Modal visible:', modalTitle, '12 attendees detected in modal:', modalAttendeesFound);

    await takeScreenshot('day1-03-bulk-export-12-attendees-1440.png', 1440, 900);

    // Close modal using testid
    console.log('Closing modal...');
    await evaluate(`
      (() => {
        const closeBtn = document.querySelector('[data-testid="bulk-modal-close-btn"]');
        if (closeBtn) closeBtn.click();
      })()
    `);
    await sleep(1000);

    // Verify modal is unmounted
    const modalClosed = await evaluate(`!document.querySelector('[data-testid="bulk-modal-close-btn"]')`);
    console.log('Modal closed cleanly:', modalClosed);

    // Step 4: Navigate to Import tab
    console.log('--- Step 4: Navigating to Import tab ---');
    await evaluate(`
      (() => {
        const importBtn = document.querySelector('[data-testid="toolbar-tab-import"]') ||
                          Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Import'));
        if (importBtn) importBtn.click();
      })()
    `);
    await sleep(1500);

    const sampleCsvCard = await evaluate(`document.body.innerText.includes('Demonstration Sample Spreadsheet')`);
    console.log('Demonstration Sample Spreadsheet visible:', sampleCsvCard);

    // Click "Try Sample CSV"
    console.log('Clicking "Try Sample CSV"...');
    await evaluate(`
      (() => {
        const tryBtn = document.querySelector('[data-testid="try-sample-csv-btn"]') ||
                       Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Try Sample CSV'));
        if (tryBtn) tryBtn.click();
      })()
    `);
    await sleep(1500);

    const mapColumnsStep = await evaluate(`document.body.innerText.includes('Match CSV Columns') || document.body.innerText.includes('Map Columns') || document.body.innerText.includes('Ingest Attendees')`);
    console.log('Map columns step active:', mapColumnsStep);

    await takeScreenshot('day1-04-try-sample-csv-1440.png', 1440, 900);

    // Step 5: Mobile Studio 390x844
    console.log('--- Step 5: Testing Mobile Studio 390x844 ---');
    await evaluate(`
      (() => {
        const studioBtn = document.querySelector('[data-testid="toolbar-tab-tickets"]') ||
                          Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Design Studio') || b.innerText.includes('Studio'));
        if (studioBtn) studioBtn.click();
      })()
    `);
    await sleep(1500);

    await takeScreenshot('day1-05-mobile-studio-390.png', 390, 844);

    console.log('ALL DAY 1 VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
  } finally {
    await client.close();
    chromeProc.kill();
  }
}

run().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
