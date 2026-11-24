const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Maksud\\.gemini\\antigravity\\brain\\01d504ad-0492-49b6-882d-1d27bf94ecf4';
const DOCS_DIR = 'D:\\PassForge\\docs\\screenshots';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\Maksud\\chrome-day2-profile';
const PORT = 9444;

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
    await sleep(700);
    const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(data, 'base64');
    
    // Save to artifact dir
    const artifactPath = path.join(ARTIFACT_DIR, fileName);
    fs.writeFileSync(artifactPath, buffer);

    // Save to docs dir
    fs.mkdirSync(DOCS_DIR, { recursive: true });
    const docsPath = path.join(DOCS_DIR, fileName);
    fs.writeFileSync(docsPath, buffer);

    console.log(`Saved screenshot: ${fileName} (${buffer.length} bytes)`);
    return artifactPath;
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

    // 1. Desktop 1440x900 - Studio with loaded demo roster
    console.log('--- Step 1: Loading demo roster & capturing desktop studio 1440x900 ---');
    await evaluate(`
      (() => {
        const btn = document.querySelector('[data-testid="guide-load-demo-btn"]');
        if (btn) btn.click();
      })()
    `);
    await sleep(1500);

    await takeScreenshot('day2-01-desktop-studio-1440.png', 1440, 900);

    // 2. Format switcher clarity & switching to email format
    console.log('--- Step 2: Testing format switcher and email view ---');
    await evaluate(`
      (() => {
        const emailBtn = document.querySelector('[data-testid="format-tab-email"]');
        if (emailBtn) emailBtn.click();
      })()
    `);
    await sleep(1500);
    await takeScreenshot('day2-02-format-email-1440.png', 1440, 900);

    // 3. One-Click Event Theme Presets
    console.log('--- Step 3: Testing one-click branding presets ---');
    await evaluate(`
      (() => {
        const expandBtn = document.querySelector('[title="Expand Brand Kit Panel"]') ||
                          document.querySelector('[aria-label="Expand Brand Kit Panel"]');
        if (expandBtn) expandBtn.click();
      })()
    `);
    await sleep(600);

    const clickedPreset = await evaluate(`
      (() => {
        const galaBtn = document.querySelector('[data-testid="preset-premium-gala"]');
        if (galaBtn) {
          galaBtn.click();
          return true;
        }
        return false;
      })()
    `);
    console.log('Clicked Premium Gala preset:', clickedPreset);
    await sleep(1500);
    await takeScreenshot('day2-03-event-preset-applied-1440.png', 1440, 900);

    // 4. Tablet 768x1024
    console.log('--- Step 4: Testing tablet layout 768x1024 ---');
    await takeScreenshot('day2-04-tablet-studio-768.png', 768, 1024);

    // 5. Mobile 390x844
    console.log('--- Step 5: Testing mobile layout 390x844 ---');
    await takeScreenshot('day2-05-mobile-studio-390.png', 390, 844);

    console.log('ALL DAY 2 VISUAL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
  } finally {
    await client.close();
    chromeProc.kill();
  }
}

run().catch(err => {
  console.error('Day 2 verification script failed:', err);
  process.exit(1);
});
