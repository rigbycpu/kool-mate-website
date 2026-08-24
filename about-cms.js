const CMS_STORAGE_KEY = "koolMateCmsContent";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadAboutCmsContent() {
  const cmsApi = location.hostname === "localhost" ? "/api/content" : "/.netlify/functions/content";
  for (const url of [cmsApi, "data/content.json"]) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) return await response.json();
    } catch {
      // Continue to fallback.
    }
  }
  try {
    return JSON.parse(localStorage.getItem(CMS_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function renderTextList(node, value, checkList = false) {
  const items = String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (!items.length) return;
  node.innerHTML = items.map((item) => {
    const label = escapeHtml(item);
    if (!checkList) return `<li>${label}</li>`;
    return `<li><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m5 12.5 4.2 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span><strong>${label}</strong></li>`;
  }).join("");
}

async function applyAboutCmsContent() {
  const saved = await loadAboutCmsContent();
  const about = saved?.about;
  if (!about || typeof about !== "object") return;

  document.querySelectorAll("[data-about]").forEach((node) => {
    const value = about[node.dataset.about];
    if (typeof value === "string" && value.trim()) node.textContent = value;
  });

  document.querySelectorAll("[data-about-list]").forEach((node) => {
    const key = node.dataset.aboutList;
    const value = about[key];
    if (typeof value === "string" && value.trim()) {
      renderTextList(node, value, node.classList.contains("check-list"));
    }
  });
}

applyAboutCmsContent();
