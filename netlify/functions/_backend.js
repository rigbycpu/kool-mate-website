const contentFile = "data/content.json";
const inquiriesFile = "data/inquiries.json";
const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabaseBucket = process.env.SUPABASE_BUCKET || "koolmate";
const bucketCandidates = [...new Set([supabaseBucket, "koolmate-cms", "koolmate"].filter(Boolean))];

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

function useSupabase() {
  return Boolean(supabaseUrl && supabaseKey);
}

function supabaseHeaders(extra = {}) {
  return {
    apikey: supabaseKey,
    authorization: `Bearer ${supabaseKey}`,
    ...extra
  };
}

async function supabaseFetch(path, options = {}) {
  if (!useSupabase()) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.");
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      ...supabaseHeaders(options.headers || {})
    }
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${detail}`);
  }
  return response;
}

async function supabaseBucketFetch(bucket, filePath, options = {}) {
  return supabaseFetch(`/storage/v1/object/${bucket}/${filePath}`, options);
}

async function writeToBucketCandidates(filePath, options = {}) {
  const errors = [];
  for (const bucket of bucketCandidates) {
    try {
      const response = await supabaseBucketFetch(bucket, filePath, options);
      return { bucket, response };
    } catch (error) {
      errors.push(`${bucket}: ${error.message}`);
    }
  }
  throw new Error(`Supabase write failed. Tried buckets: ${errors.join(" | ")}`);
}

async function withAvailableBucket(filePath, options = {}) {
  const errors = [];
  for (const bucket of bucketCandidates) {
    try {
      const response = await supabaseBucketFetch(bucket, filePath, options);
      return { bucket, response };
    } catch (error) {
      errors.push(`${bucket}: ${error.message}`);
    }
  }
  throw new Error(`Supabase bucket/file failed. Tried: ${errors.join(" | ")}`);
}

async function readJsonFile(filePath, fallback) {
  const { response } = await withAvailableBucket(filePath, {
    headers: { accept: "application/json" }
  });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath, payload) {
  await writeToBucketCandidates(filePath, {
    method: "POST",
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      "x-upsert": "true"
    },
    body: `${JSON.stringify(payload, null, 2)}\n`
  });
}

async function uploadBase64File(filePath, contentType, base64Content) {
  const buffer = Buffer.from(base64Content, "base64");
  const { bucket } = await writeToBucketCandidates(filePath, {
    method: "POST",
    headers: {
      "cache-control": "31536000",
      "content-type": contentType,
      "x-upsert": "true"
    },
    body: buffer
  });
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
}

module.exports = {
  contentFile,
  inquiriesFile,
  isAuthed,
  json,
  readJsonFile,
  requireAuth,
  supabaseBucket,
  uploadBase64File,
  useSupabase,
  writeJsonFile
};
