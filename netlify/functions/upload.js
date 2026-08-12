const crypto = require("node:crypto");
const { json, putGithubFile, requireAuth } = require("./_github");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return json(405, { ok: false, message: "Method not allowed." });

    const auth = requireAuth(event);
    if (auth) return auth;

    const payload = JSON.parse(event.body || "{}");
    const match = String(payload.dataUrl || "").match(/^data:(image\/(?:png|jpeg|jpg|webp)|application\/pdf);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return json(400, { ok: false, message: "Upload must be a PNG, JPG, WEBP, or PDF file." });

    const extension = match[1] === "application/pdf" ? ".pdf" : match[1].includes("png") ? ".png" : match[1].includes("webp") ? ".webp" : ".jpg";
    const buffer = Buffer.from(match[2], "base64");
    if (buffer.length > 5_000_000) return json(400, { ok: false, message: "File must be 5MB or smaller." });

    const filename = `uploads/cms-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${extension}`;
    await putGithubFile(filename, buffer.toString("base64"), "Upload KOOLMATE CMS file", { base64: true });

    return json(200, { ok: true, url: `/${filename}` });
  } catch (error) {
    return json(500, { ok: false, message: error.message || "Server error." });
  }
};
