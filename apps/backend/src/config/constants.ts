import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BACKEND_ROOT = path.resolve(__dirname, '..', '..');
export const FONTS_DIR = path.resolve(BACKEND_ROOT, 'assets', 'fonts');
export const OUTPUT_DIR = path.resolve(BACKEND_ROOT, 'output');

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB limit
export const MAX_CSV_ROWS = 500; // 500 attendees maximum for public demo safety and memory bounds
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const FRONTEND_DIST = path.resolve(BACKEND_ROOT, '..', 'frontend', 'dist');

