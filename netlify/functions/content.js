const { contentFile, decodeBase64, getGithubFile, json, putGithubFile, requireAuth } = require("./_github");

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "GET") {
      const file = await getGithubFile(contentFile);
      if (!file?.content) return json(404, { ok: false, message: "Content file not found." });
      return {
        statusCode: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        },
        body: decodeBase64(file.content)
      };
    }

    if (event.httpMethod === "POST") {
      const auth = requireAuth(event);
      if (auth) return auth;
      const payload = JSON.parse(event.body || "{}");
      await putGithubFile(contentFile, `${JSON.stringify(payload, null, 2)}\n`, "Update KOOLMATE CMS content");
      return json(200, { ok: true, savedAt: new Date().toISOString() });
    }

    return json(405, { ok: false, message: "Method not allowed." });
  } catch (error) {
    return json(500, { ok: false, message: error.message || "Server error." });
  }
};
