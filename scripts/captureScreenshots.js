import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9225;
const OUTPUT_DIR = "d:\\PassForge\\screenshots";

const chromeProc = spawn(CHROME_PATH, [
  '--headless=new',
  '--remote-debugging-port=' + PORT,
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--user-data-dir=' + path.join(process.env.TEMP || 'C:\\Temp', 'chrome_cdp_editorial_' + Date.now())
]);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      const tabs = await res.json();
      if (tabs && tabs.length > 0 && tabs[0].webSocketDebuggerUrl) {
        return tabs[0].webSocketDebuggerUrl;
      }
    } catch {}
    await wait(300);
  }
  throw new Error("Could not connect to Chrome DevTools port");
}

async function run() {
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        callbacks.get(data.id)(data);
        callbacks.delete(data.id);
      }
    };

    await new Promise(resolve => ws.onopen = resolve);

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    console.log("Navigating to http://localhost:5173...");
    await send('Page.navigate', { url: 'http://localhost:5173' });
    await wait(2500);

    // 1. Switch to Editorial layout
    console.log("Clicking [data-testid='design-card-editorial']...");
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('[data-testid="design-card-editorial"]');
          if (card) card.click();
        })()
      `
    });
    await wait(2500);

    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUTPUT_DIR, '01-ticket-studio-editorial-1440.png'), Buffer.from(shot.result.data, 'base64'));
    console.log("Saved 01-ticket-studio-editorial-1440.png");

    // 2. Open Ticket Preview Modal from Directory
    console.log("Navigating to Attendee Directory & Opening Modal...");
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const navBtns = Array.from(document.querySelectorAll('header nav button'));
          if (navBtns[3]) navBtns[3].click();
        })()
      `
    });
    await wait(1200);

    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const previewBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Preview Pass'));
          if (previewBtn) previewBtn.click();
        })()
      `
    });
    await wait(2500);

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUTPUT_DIR, '05-ticket-modal-preview-1440.png'), Buffer.from(shot.result.data, 'base64'));
    console.log("Saved 05-ticket-modal-preview-1440.png");

    ws.close();
  } catch (err) {
    console.error("Error during capture:", err);
  } finally {
    chromeProc.kill();
  }
}

run();