const { contentFile, json, readJsonFile, requireAuth, writeJsonFile } = require("./_backend");

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "GET") {
      const content = await readJsonFile(contentFile, {});
      return json(200, content);
    }

    if (event.httpMethod === "POST") {
      const auth = requireAuth(event);
      if (auth) return auth;
      const payload = JSON.parse(event.body || "{}");
      await writeJsonFile(contentFile, payload);
      return json(200, { ok: true, savedAt: new Date().toISOString() });
    }

    return json(405, { ok: false, message: "Method not allowed." });
  } catch (error) {
    return json(500, { ok: false, message: error.message || "Server error." });
  }
};
