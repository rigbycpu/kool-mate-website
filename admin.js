const CMS_STORAGE_KEY = "koolMateCmsContent";
const API_BASE = location.hostname === "localhost" ? "/api" : "/.netlify/functions";
const API_CONTENT = `${API_BASE}/content`;
const API_SESSION = `${API_BASE}/session`;
const API_LOGIN = `${API_BASE}/login`;
const API_LOGOUT = `${API_BASE}/logout`;
const API_UPLOAD = `${API_BASE}/upload`;

const defaults = {
  business: {
    phone: "+63 993 551 5531",
    phoneSms: "+639935515531",
    email: "koolmateadmin070826@gmail.com",
    address: "244 Mikas Street, Real 1, Bacoor, Cavite, Philippines, 4102",
    messenger: "https://m.me/61591997337938"
  },
  en: {
    heroTitle: "Cooler Air.<br><span>Cleaner Comfort.</span><br>Smarter Savings.",
    heroTagline: "Choose Kool Mate!",
    heroLead: "Professional air-conditioning service for a cooler, cleaner and more energy-efficient home or business.",
    workText: "Real installation, cleaning and repair project photos will be posted soon."
  },
  fil: {
    heroTitle: "Mas Malamig.<br><span>Mas Malinis.</span><br>Mas Tipid.",
    heroTagline: "I-Kool Mate Mo Yan!",
    heroLead: "Propesyonal na aircon service para sa mas malamig, malinis at matipid na tahanan o negosyo.",
    workText: "Malapit nang maipakita ang totoong installation, cleaning at repair project photos."
  },
  workItems: [
    { type: "empty", title: { en: "Installation Work", fil: "Installation Work" }, status: { en: "", fil: "" }, image: "", url: "" },
    { type: "empty", title: { en: "Aircon Cleaning", fil: "Aircon Cleaning" }, status: { en: "", fil: "" }, image: "", url: "" },
    { type: "empty", title: { en: "Repair Service", fil: "Repair Service" }, status: { en: "", fil: "" }, image: "", url: "" },
    { type: "empty", title: { en: "Maintenance Visit", fil: "Maintenance Visit" }, status: { en: "", fil: "" }, image: "", url: "" },
    { type: "empty", title: { en: "Commercial Service", fil: "Commercial Service" }, status: { en: "", fil: "" }, image: "", url: "" }
  ]
};

const uiText = {
  en: {
    cmsLabel: "Self-Edit CMS",
    title: "Kool Mate Website Editor",
    viewSite: "View Site",
    manualEyebrow: "Manual",
    manualTitle: "How to edit",
    manualOne: "Update the fields you want to change.",
    manualTwo: "For Our Work, choose Empty, Photo, or Link.",
    manualThree: "Check the live preview beside the editor, then click Save Changes.",
    noteTitle: "Note",
    noteText: "This CMS saves edits to the live website server. Use Export Backup before large content changes.",
    editorEyebrow: "Website Content",
    editorTitle: "Edit public content",
    importBtn: "Import",
    exportBtn: "Export Backup",
    resetBtn: "Reset",
    tabBusiness: "Business",
    tabHome: "Home Text",
    tabWork: "Our Work",
    phone: "Phone",
    smsPhone: "SMS Phone",
    email: "Email",
    messenger: "Messenger Link",
    address: "Address",
    languageNote: "Edit English and Filipino public text separately.",
    lockedTitle: "Developer locked fields",
    lockedNote: "Locked fields control layout or formatting and should be edited by a developer.",
    lockedBadge: "Developer locked",
    saveBtn: "Save Changes",
    saved: "Saved to the live website.",
    resetDone: "Reset complete.",
    imported: "Imported and saved.",
    workType: "Type",
    workEmpty: "Empty",
    workPhoto: "Photo",
    workLink: "Link",
    workImage: "Photo URL",
    workUpload: "Upload Photo",
    workUrl: "Link URL",
    workTitleEn: "Title English",
    workTitleFil: "Title Filipino",
    workStatusEn: "Custom status English",
    workStatusFil: "Custom status Filipino",
    previewLabel: "Live Look"
  },
  fil: {
    cmsLabel: "Self-Edit CMS",
    title: "Kool Mate Website Editor",
    viewSite: "Tingnan ang Site",
    manualEyebrow: "Manual",
    manualTitle: "Paano mag-edit",
    manualOne: "Palitan ang fields na gusto mong baguhin.",
    manualTwo: "Sa Our Work, pumili ng Empty, Photo, o Link.",
    manualThree: "Tingnan ang live preview sa tabi ng editor, tapos pindutin ang Save Changes.",
    noteTitle: "Paalala",
    noteText: "Ang CMS na ito ay nagsasave sa live website server. Gumamit ng Export Backup bago malaking content changes.",
    editorEyebrow: "Website Content",
    editorTitle: "I-edit ang public content",
    importBtn: "Import",
    exportBtn: "Export Backup",
    resetBtn: "Reset",
    tabBusiness: "Business",
    tabHome: "Home Text",
    tabWork: "Our Work",
    phone: "Phone",
    smsPhone: "SMS Phone",
    email: "Email",
    messenger: "Messenger Link",
    address: "Address",
    languageNote: "I-edit nang hiwalay ang English at Filipino public text.",
    lockedTitle: "Developer locked fields",
    lockedNote: "Ang locked fields ay may epekto sa layout o formatting. Developer dapat ang mag-edit nito.",
    lockedBadge: "Developer locked",
    saveBtn: "Save Changes",
    saved: "Saved na sa live website.",
    resetDone: "Reset complete.",
    imported: "Imported and saved.",
    workType: "Type",
    workEmpty: "Empty",
    workPhoto: "Photo",
    workLink: "Link",
    workImage: "Photo URL",
    workUpload: "Upload Photo",
    workUrl: "Link URL",
    workTitleEn: "Title English",
    workTitleFil: "Title Filipino",
    workStatusEn: "Custom status English",
    workStatusFil: "Custom status Filipino",
    previewLabel: "Live Look"
  }
};

let cmsLanguage = localStorage.getItem("koolMateCmsLanguage") || "en";
let state = clone(defaults);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function loadState() {
  try {
    const response = await fetch(API_CONTENT, { cache: "no-store" });
    if (response.ok) return { ...clone(defaults), ...(await response.json()) };
  } catch {
    // Static preview fallback.
  }
  try {
    return { ...clone(defaults), ...(JSON.parse(localStorage.getItem(CMS_STORAGE_KEY)) || {}) };
  } catch {
    return clone(defaults);
  }
}

async function saveState() {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(state, null, 2));
  const response = await fetch(API_CONTENT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(state)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Unable to save to server.");
  }
}

function getPath(object, path) {
  return path.split(".").reduce((result, key) => result?.[key], object);
}

function setPath(object, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((result, key) => {
    result[key] = result[key] || {};
    return result[key];
  }, object);
  target[last] = value;
}

function applyUiLanguage() {
  const copy = uiText[cmsLanguage];
  document.documentElement.lang = cmsLanguage === "fil" ? "fil" : "en";
  document.querySelectorAll("[data-ui]").forEach((node) => {
    node.textContent = copy[node.dataset.ui] || node.textContent;
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === cmsLanguage);
  });
  renderWorkEditor();
}

function fillForm() {
  document.querySelectorAll("[name]").forEach((input) => {
    input.value = getPath(state, input.name) || "";
  });
  lockCodeFields();
}

function lockCodeFields() {
  document.querySelectorAll("[data-code-lock]").forEach((input) => {
    input.readOnly = true;
    input.setAttribute("aria-readonly", "true");
    input.setAttribute("tabindex", "-1");
  });
}

function placePreviewBesideEditor() {
  const preview = document.querySelector(".mini-site-preview");
  const editorPanel = document.querySelector(".editor-panel");
  if (!preview || !editorPanel || preview.parentElement === editorPanel) return;
  editorPanel.appendChild(preview);
}

function renderWorkEditor() {
  const copy = uiText[cmsLanguage];
  const editor = document.getElementById("workEditor");
  editor.innerHTML = state.workItems.map((item, index) => `
    <article class="work-edit-card">
      <div class="work-edit-head">
        <strong>Slot ${String(index + 1).padStart(2, "0")}</strong>
        <select name="workItems.${index}.type" aria-label="${copy.workType}">
          <option value="empty">${copy.workEmpty}</option>
          <option value="photo">${copy.workPhoto}</option>
          <option value="link">${copy.workLink}</option>
        </select>
      </div>
      <div class="work-fields">
        <label><span>${copy.workTitleEn}</span><input name="workItems.${index}.title.en"></label>
        <label><span>${copy.workTitleFil}</span><input name="workItems.${index}.title.fil"></label>
        <label><span>${copy.workImage}</span><input name="workItems.${index}.image" placeholder="assets/work-photo.jpg or https://..."></label>
        <label><span>${copy.workUpload}</span><input type="file" accept="image/png,image/jpeg,image/webp" data-work-upload="${index}"></label>
        <label><span>${copy.workUrl}</span><input name="workItems.${index}.url" placeholder="https://facebook.com/..."></label>
        <label><span>${copy.workStatusEn}</span><input name="workItems.${index}.status.en" placeholder="Optional"></label>
        <label><span>${copy.workStatusFil}</span><input name="workItems.${index}.status.fil" placeholder="Optional"></label>
      </div>
    </article>
  `).join("");
  fillForm();
  setupUploads();
}

function setStatus(message) {
  document.getElementById("saveStatus").textContent = message;
}

function stripHtml(value) {
  const template = document.createElement("template");
  template.innerHTML = (value || "").replace(/<br\s*\/?>/gi, " ");
  return template.content.textContent || "";
}

function collectFormState() {
  document.querySelectorAll("#cmsForm [name]").forEach((input) => {
    if (input.type === "file") return;
    setPath(state, input.name, input.value.trim());
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function setupUploads() {
  document.querySelectorAll("[data-work-upload]").forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      const index = Number(input.dataset.workUpload);
      setStatus("Uploading image...");
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const response = await fetch(API_UPLOAD, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ filename: file.name, dataUrl })
        });
        if (!response.ok) throw new Error((await response.json()).message || "Upload failed.");
        const payload = await response.json();
        state.workItems[index].image = payload.url;
        state.workItems[index].type = "photo";
        fillForm();
        updatePreview();
        setStatus("Image uploaded. Click Save Changes to publish.");
      } catch (error) {
        setStatus(error.message || "Upload failed.");
      }
    });
  });
}

function updatePreview() {
  document.getElementById("previewHeroTitle").textContent = stripHtml(state.en.heroTitle);
  document.getElementById("previewHeroTagline").textContent = state.en.heroTagline || "Choose Kool Mate!";
  document.getElementById("previewHeroLead").textContent = state.en.heroLead || "";
  document.getElementById("previewPhone").textContent = state.business.phone || "";
  document.getElementById("previewEmail").textContent = state.business.email || "";

  document.getElementById("previewWork").innerHTML = state.workItems.slice(0, 5).map((item, index) => {
    const type = item.type || "empty";
    const title = item.title?.en || `Work ${index + 1}`;
    const isPhoto = type === "photo" && item.image;
    const isLink = type === "link" && item.url;
    const media = isPhoto ? `<img src="${item.image}" alt="">` : `<span>${String(index + 1).padStart(2, "0")}</span>`;
    const status = item.status?.en || (isPhoto ? "View Photo" : isLink ? "Open Link" : "Unavailable");
    return `<article class="mini-work-card ${isPhoto ? "has-photo" : ""}">${media}<strong>${title}</strong><small>${status}</small></article>`;
  }).join("");
}

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    cmsLanguage = button.dataset.lang;
    localStorage.setItem("koolMateCmsLanguage", cmsLanguage);
    applyUiLanguage();
  });
});

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-tab]").forEach((node) => node.classList.toggle("active", node === button));
    document.querySelectorAll("[data-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === button.dataset.tab));
  });
});

document.getElementById("cmsForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  collectFormState();
  try {
    await saveState();
    updatePreview();
    setStatus(uiText[cmsLanguage].saved);
  } catch (error) {
    setStatus(error.message || "Unable to save.");
  }
});

document.getElementById("cmsForm").addEventListener("input", () => {
  collectFormState();
  updatePreview();
});

document.getElementById("cmsForm").addEventListener("change", () => {
  collectFormState();
  updatePreview();
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "kool-mate-cms-backup.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  state = { ...clone(defaults), ...JSON.parse(await file.text()) };
  await saveState().catch((error) => setStatus(error.message || "Imported locally, but server save failed."));
  fillForm();
  renderWorkEditor();
  updatePreview();
  setStatus(uiText[cmsLanguage].imported);
});

document.getElementById("resetBtn").addEventListener("click", async () => {
  if (!confirm("Reset all CMS edits?")) return;
  state = clone(defaults);
  localStorage.removeItem(CMS_STORAGE_KEY);
  await saveState().catch((error) => setStatus(error.message || "Reset locally, but server save failed."));
  fillForm();
  renderWorkEditor();
  updatePreview();
  setStatus(uiText[cmsLanguage].resetDone);
});

async function checkSession() {
  try {
    const response = await fetch(API_SESSION, { cache: "no-store" });
    const payload = await response.json();
    return Boolean(payload.authenticated);
  } catch {
    return true;
  }
}

function showLogin(show) {
  document.getElementById("loginScreen").hidden = !show;
  document.body.classList.toggle("is-locked", show);
}

function setupLogin() {
  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("loginStatus");
    const password = new FormData(event.currentTarget).get("password");
    status.textContent = "Checking password...";
    try {
      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (!response.ok) throw new Error((await response.json()).message || "Login failed.");
      showLogin(false);
      status.textContent = "";
      await initializeEditor();
    } catch (error) {
      status.textContent = error.message || "Login failed.";
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch(API_LOGOUT, { method: "POST" }).catch(() => {});
    showLogin(true);
  });
}

async function initializeEditor() {
  state = await loadState();
  placePreviewBesideEditor();
  applyUiLanguage();
  fillForm();
  updatePreview();
}

async function boot() {
  setupLogin();
  const authenticated = await checkSession();
  showLogin(!authenticated);
  if (authenticated) await initializeEditor();
}

boot();
