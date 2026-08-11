const { decodeBase64, getGithubFile, inquiriesFile, json, putGithubFile, requireAuth } = require("./_github");

function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

async function readInquiries() {
  const file = await getGithubFile(inquiriesFile);
  if (!file?.content) return [];
  try {
    const parsed = JSON.parse(decodeBase64(file.content));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeInquiries(items) {
  await putGithubFile(inquiriesFile, `${JSON.stringify(items, null, 2)}\n`, "Update KOOLMATE inquiries");
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "GET") {
      const auth = requireAuth(event);
      if (auth) return auth;
      return json(200, { ok: true, inquiries: await readInquiries() });
    }

    if (event.httpMethod === "POST") {
      const payload = JSON.parse(event.body || "{}");
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
        return json(400, { ok: false, message: "Missing required inquiry fields." });
      }

      const items = await readInquiries();
      items.unshift(inquiry);
      await writeInquiries(items.slice(0, 200));
      return json(200, { ok: true, inquiry });
    }

    if (event.httpMethod === "PATCH") {
      const auth = requireAuth(event);
      if (auth) return auth;
      const payload = JSON.parse(event.body || "{}");
      const items = await readInquiries();
      const next = items.map((item) => (
        item.id === payload.id ? { ...item, status: payload.status === "done" ? "done" : "new" } : item
      ));
      await writeInquiries(next);
      return json(200, { ok: true });
    }

    return json(405, { ok: false, message: "Method not allowed." });
  } catch (error) {
    return json(500, { ok: false, message: error.message || "Server error." });
  }
};
