const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");

const root = __dirname;
const dataDir = path.join(root, "data");
const uploadsDir = path.join(root, "uploads");
const contentPath = path.join(dataDir, "content.json");
const inquiriesPath = path.join(dataDir, "inquiries.json");
const port = Number(process.env.PORT || 4173);
const adminPassword = process.env.CMS_PASSWORD || "koolmate-admin";
const sessions = new Set();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(inquiriesPath)) fs.writeFileSync(inquiriesPath, "[]\n");

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function sendJson(res, status, payload, headers = {}) {
  send(res, status, JSON.stringify(payload), {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...headers
  });
}

function readBody(req, limit = 7_500_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("Request body is too large."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function getSession(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/(?:^|;\s*)kool_mate_cms=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function isAuthed(req) {
  return sessions.has(getSession(req));
}

function requireAuth(req, res) {
  if (isAuthed(req)) return true;
  sendJson(res, 401, { ok: false, message: "Login required." });
  return false;
}

function readContent() {
  return JSON.parse(fs.readFileSync(contentPath, "utf8"));
}

function writeContent(content) {
  fs.writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`);
}

function readInquiries() {
  try {
    const parsed = JSON.parse(fs.readFileSync(inquiriesPath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeInquiries(items) {
  fs.writeFileSync(inquiriesPath, `${JSON.stringify(items, null, 2)}\n`);
}

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function safeStaticPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const targetPath = cleanPath === "/" ? "/index.html" : cleanPath;
  const filePath = path.normalize(path.join(root, targetPath));
  if (!filePath.startsWith(root)) return "";
  return filePath;
}

function serveStatic(req, res, pathname) {
  const filePath = safeStaticPath(pathname);
  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    send(res, 404, "Not found", { "content-type": "text/plain; charset=utf-8" });
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const noStore = pathname.endsWith("admin.html") || pathname.startsWith("/data/");
  send(res, 200, fs.readFileSync(filePath), {
    "content-type": mimeTypes[ext] || "application/octet-stream",
    "cache-control": noStore ? "no-store" : "public, max-age=3600"
  });
}

function saveUpload(payload) {
  const match = String(payload.dataUrl || "").match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("Upload must be a PNG, JPG, or WEBP image.");
  const extension = match[1].includes("png") ? ".png" : match[1].includes("webp") ? ".webp" : ".jpg";
  const filename = `work-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${extension}`;
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > 5_000_000) throw new Error("Image must be 5MB or smaller.");
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

async function handleApi(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/content") {
    sendJson(res, 200, readContent());
    return;
  }

  if (req.method === "GET" && pathname === "/api/session") {
    sendJson(res, 200, { ok: true, authenticated: isAuthed(req) });
    return;
  }

  if (req.method === "POST" && pathname === "/api/login") {
    const payload = JSON.parse(await readBody(req, 100_000) || "{}");
    if (payload.password !== adminPassword) {
      sendJson(res, 403, { ok: false, message: "Incorrect password." });
      return;
    }
    const token = crypto.randomBytes(32).toString("hex");
    sessions.add(token);
    sendJson(res, 200, { ok: true }, {
      "set-cookie": `kool_mate_cms=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`
    });
    return;
  }

  if (req.method === "POST" && pathname === "/api/logout") {
    sessions.delete(getSession(req));
    sendJson(res, 200, { ok: true }, {
      "set-cookie": "kool_mate_cms=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0"
    });
    return;
  }

  if (req.method === "POST" && pathname === "/api/content") {
    if (!requireAuth(req, res)) return;
    const payload = JSON.parse(await readBody(req) || "{}");
    writeContent(payload);
    sendJson(res, 200, { ok: true, savedAt: new Date().toISOString() });
    return;
  }

  if (req.method === "POST" && pathname === "/api/upload") {
    if (!requireAuth(req, res)) return;
    const payload = JSON.parse(await readBody(req) || "{}");
    sendJson(res, 200, { ok: true, url: saveUpload(payload) });
    return;
  }

  if (pathname === "/api/inquiries") {
    if (req.method === "GET") {
      if (!requireAuth(req, res)) return;
      sendJson(res, 200, { ok: true, inquiries: readInquiries() });
      return;
    }

    if (req.method === "POST") {
      const payload = JSON.parse(await readBody(req) || "{}");
      const inquiry = {
        id: `inq-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "new",
        name: clean(payload.name, 120),
        phone: clean(payload.phone, 80),
        email: clean(payload.email, 160),
        service: clean(payload.service, 160),
        date: clean(payload.date, 80),
        message: clean(payload.message, 1200)
      };
      if (!inquiry.name || !inquiry.phone || !inquiry.email || !inquiry.service || !inquiry.message) {
        sendJson(res, 400, { ok: false, message: "Missing required inquiry fields." });
        return;
      }
      const items = readInquiries();
      items.unshift(inquiry);
      writeInquiries(items.slice(0, 200));
      sendJson(res, 200, { ok: true, inquiry });
      return;
    }

    if (req.method === "PATCH") {
      if (!requireAuth(req, res)) return;
      const payload = JSON.parse(await readBody(req) || "{}");
      const next = readInquiries().map((item) => (
        item.id === payload.id ? { ...item, status: payload.status === "done" ? "done" : "new" } : item
      ));
      writeInquiries(next);
      sendJson(res, 200, { ok: true });
      return;
    }
  }

  sendJson(res, 404, { ok: false, message: "API route not found." });
}

const server = http.createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    if (pathname.startsWith("/api/")) {
      await handleApi(req, res, pathname);
      return;
    }
    serveStatic(req, res, pathname);
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message || "Server error." });
  }
});

server.listen(port, () => {
  console.log(`KOOLMATE website + CMS running at http://localhost:${port}`);
  console.log(`CMS password: ${adminPassword}`);
});
