const defaultBranch = process.env.GITHUB_BRANCH || "main";
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;
const contentFile = "data/content.json";
const inquiriesFile = "data/inquiries.json";

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders
    },
    body: JSON.stringify(body)
  };
}

function requireConfig() {
  if (!repo || !token) {
    throw new Error("Missing GITHUB_REPO or GITHUB_TOKEN environment variable.");
  }
}

function githubHeaders() {
  return {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    "user-agent": "kool-mate-cms"
  };
}

function encodeBase64(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

function decodeBase64(value) {
  return Buffer.from(value || "", "base64").toString("utf8");
}

async function getGithubFile(filePath) {
  requireConfig();
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}?ref=${defaultBranch}`, {
    headers: githubHeaders()
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub read failed: ${response.status}`);
  return response.json();
}

async function putGithubFile(filePath, content, message, options = {}) {
  requireConfig();
  const current = await getGithubFile(filePath);
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    headers: githubHeaders(),
    body: JSON.stringify({
      message,
      branch: defaultBranch,
      content: options.base64 ? content : encodeBase64(content),
      sha: current?.sha
    })
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub save failed: ${response.status} ${detail}`);
  }
  return response.json();
}

function getCookie(event, name) {
  const cookie = event.headers.cookie || event.headers.Cookie || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function isAuthed(event) {
  return getCookie(event, "kool_mate_cms") === process.env.CMS_SESSION_SECRET;
}

function requireAuth(event) {
  if (isAuthed(event)) return null;
  return json(401, { ok: false, message: "Login required." });
}

module.exports = {
  contentFile,
  decodeBase64,
  defaultBranch,
  getGithubFile,
  inquiriesFile,
  isAuthed,
  json,
  putGithubFile,
  requireAuth
};
