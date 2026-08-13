const crypto = require("node:crypto");
const { json, requireAuth, uploadBase64File } = require("./_backend");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return json(405, { ok: false, message: "Method not allowed." });

    const auth = requireAuth(event);
    if (auth) return auth;

    const payload = JSON.parse(event.body || "{}");
    const match = String(payload.dataUrl || "").match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return json(400, { ok: false, message: "Upload must be a valid file." });

    const contentType = match[1].toLowerCase();
    const extensionMap = {
      "image/avif": ".avif",
      "image/bmp": ".bmp",
      "image/gif": ".gif",
      "image/heic": ".heic",
      "image/heif": ".heif",
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/svg+xml": ".svg",
      "image/webp": ".webp",
      "application/pdf": ".pdf"
    };
    const extension = extensionMap[contentType] || ".file";
    const folder = contentType === "application/pdf" ? "price-lists" : "uploads";
    const filename = `${folder}/cms-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${extension}`;
    const publicUrl = await uploadBase64File(filename, contentType, match[2]);

    return json(200, { ok: true, url: publicUrl });
  } catch (error) {
    return json(500, { ok: false, message: error.message || "Server error." });
  }
};
