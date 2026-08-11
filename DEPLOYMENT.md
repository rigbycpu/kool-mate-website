# KOOLMATE Website + CMS Deployment for Netlify/GitHub

## Recommended Setup

Deploy this project on **Netlify** and connect it to a **GitHub repository**.

The website and CMS are static, while Netlify Functions handle secure saving.
CMS edits are saved by committing updates to the GitHub repository:

- `data/content.json` for text/contact/work content
- `data/inquiries.json` for customer quote inquiries
- `uploads/` for CMS-uploaded work photos

## Why Not GitHub Pages Only?

GitHub Pages can host the public website, but it cannot securely run CMS save actions by itself.
Do not put a GitHub token directly in browser JavaScript.

Use Netlify for the CMS backend, or use a separate backend service.

## Netlify Environment Variables

Set these in:

`Netlify Dashboard > Site configuration > Environment variables`

```text
CMS_PASSWORD=your-private-admin-password
CMS_SESSION_SECRET=random-long-private-session-string
GITHUB_TOKEN=github-personal-access-token
GITHUB_REPO=username/repository-name
GITHUB_BRANCH=main
```

## GitHub Token Permissions

Create a GitHub fine-grained token with access to the chosen repository.

Required permission:

```text
Contents: Read and write
```

This lets the CMS update `data/content.json` and add images under `uploads/`.

## Where The Client Sees Inquiries

After deployment, the client opens:

```text
https://your-site.netlify.app/admin.html
```

Login with `CMS_PASSWORD`, then open the **Inquiries** tab.

Website form submissions are saved to:

```text
data/inquiries.json
```

The CMS shows each inquiry with call, SMS, email, and mark done/new actions.

## Netlify Build Settings

Use:

```text
Build command: leave blank
Publish directory: .
Functions directory: netlify/functions
```

The included `netlify.toml` already sets:

```toml
[build]
  publish = "."
  functions = "netlify/functions"
```

## Links After Deployment

```text
Website: https://your-site.netlify.app/
CMS: https://your-site.netlify.app/admin.html
```

## Important Backup Note

Because the CMS saves to GitHub, every edit becomes part of the repository history.
That is good for rollback and backup.
