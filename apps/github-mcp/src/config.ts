import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Temporarily suppress console.log to prevent dotenv from printing to stdout and breaking MCP
const originalConsoleLog = console.log;
console.log = () => {};
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log = originalConsoleLog;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("CRITICAL ERROR: GITHUB_TOKEN is missing in environment variables or .env file.");
  console.error("Please create a .env file based on .env.example and add your GitHub Personal Access Token.");
  process.exit(1);
}

export const config = {
  githubToken: GITHUB_TOKEN,
};
