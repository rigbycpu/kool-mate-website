# KOOLMATE Supabase CMS Setup

Use this setup when the CMS should save edits and uploads without creating GitHub commits or triggering Netlify redeploys.

## 1. Create Supabase Project

1. Go to Supabase.
2. Create a new project.
3. Copy these from Project Settings > API:
   - Project URL
   - service_role key

Keep the service role key private. Put it only in Netlify environment variables.

## 2. Create Storage Bucket

1. Go to Storage.
2. Create a bucket named:

```text
koolmate
```

3. Set the bucket to Public.

## 3. Upload Starter Content

In the `koolmate` bucket, upload these files with the same paths:

```text
data/content.json
data/inquiries.json
```

Use the local files:

```text
data/content.json
data/inquiries.json
```

If `data/inquiries.json` does not exist yet, create it with:

```json
[]
```

## 4. Netlify Environment Variables

Add these in Netlify > Site configuration > Environment variables:

```text
CMS_PASSWORD = koolmate-admin
CMS_SESSION_SECRET = koolmate-session-2026-secure-random-928374
SUPABASE_URL = https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
SUPABASE_BUCKET = koolmate
```

You no longer need these for CMS saving:

```text
GITHUB_REPO
GITHUB_BRANCH
GITHUB_TOKEN
```

## 5. Redeploy

After saving the environment variables:

1. Go to Netlify Deploys.
2. Trigger deploy.
3. Deploy site.
4. Open `/admin.html`.
5. Test save and image upload.

CMS edits now save to Supabase and do not trigger Netlify deploys.
