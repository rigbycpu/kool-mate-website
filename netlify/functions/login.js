const { json } = require("./_github");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return json(405, { ok: false, message: "Method not allowed." });

    const payload = JSON.parse(event.body || "{}");
    const password = process.env.CMS_PASSWORD;
    const sessionSecret = process.env.CMS_SESSION_SECRET;

    if (!password || !sessionSecret) {
      return json(500, { ok: false, message: "Missing CMS_PASSWORD or CMS_SESSION_SECRET." });
    }

    if (payload.password !== password) {
      return json(403, { ok: false, message: "Incorrect password." });
    }

    return json(200, { ok: true }, {
      "set-cookie": `kool_mate_cms=${encodeURIComponent(sessionSecret)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`
    });
  } catch (error) {
    return json(500, { ok: false, message: error.message || "Server error." });
  }
};
