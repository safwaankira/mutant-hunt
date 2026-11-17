// Serves the app under test from a working copy. Mutant Hunt rewrites files in
// that copy between runs; the server never caches, so each Kane run sees the
// current mutant. For apps that need their own dev server, `start` in the
// config is run inside the working copy instead.

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".ico": "image/x-icon", ".woff2": "font/woff2",
};

export function serveStatic(root, port) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = path.join(root, urlPath);
    if (!file.startsWith(path.resolve(root))) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) { res.writeHead(404).end("not found"); return; }
    res.writeHead(200, {
      "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store, max-age=0",
    });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve({ url: `http://localhost:${port}/`, close: () => new Promise((r) => server.close(r)) }));
  });
}

export async function startCommand(command, cwd, port, readyUrl, timeoutMs = 60_000) {
  const child = spawn(command, { cwd, shell: true, env: { ...process.env, PORT: String(port) }, stdio: "ignore", detached: true });
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try { if ((await fetch(readyUrl)).ok) break; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  return { url: readyUrl, close: async () => { try { process.kill(-child.pid); } catch { /* gone */ } } };
}

export function copyDir(from, to, ignore = ["node_modules", ".git", ".mutant-hunt"]) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true, filter: (src) => !ignore.includes(path.basename(src)) });
}
