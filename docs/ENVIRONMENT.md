# Environment Variables & OAuth Guide

This file explains the environment variables used by the project, how to obtain OAuth credentials for each provider, required scopes, redirect-URI examples, security best practices, debugging tips, and test/verification commands.

## Quick overview

- Copy the example file: `cp .env.example .env` and edit, OR
- Use your host's secret manager (recommended for production). For Cloudflare Workers use `npx wrangler secret put <KEY>`.
- Ensure each OAuth app's Redirect URI matches your deployed callback (or local dev URI).

## Environment variables (copy these into `.env` or set as secrets)

```
# Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Microsoft (Outlook, Office 365)
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

# Yahoo
YAHOO_CLIENT_ID=your_yahoo_client_id
YAHOO_CLIENT_SECRET=your_yahoo_client_secret

# AOL
AOL_CLIENT_ID=your_aol_client_id
AOL_CLIENT_SECRET=your_aol_client_secret

# Yandex
YANDEX_CLIENT_ID=your_yandex_client_id
YANDEX_CLIENT_SECRET=your_yandex_client_secret

# Zoho
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret

# Mail.ru
MAILRU_CLIENT_ID=your_mailru_client_id
MAILRU_CLIENT_SECRET=your_mailru_client_secret
```

Only add the providers you plan to support. Missing client credentials for a provider will simply disable that provider.

## Provider-specific setup (concise step-by-step)

- **Google (Gmail)**

  1.  Go to the Google Cloud Console: https://console.cloud.google.com/
  2.  Create a project, enable the **Gmail API**.
  3.  OAuth consent screen → set type to External (or Internal for orgs). Add scopes: at minimum `https://www.googleapis.com/auth/gmail.readonly` or `https://mail.google.com/` for full mail access.
  4.  Credentials → Create OAuth Client ID → Web application. Add Redirect URI(s): e.g. `https://mailauth.roastlang.wiki/callback` and `http://localhost:8787/callback` for testing.
  5.  Copy `Client ID` and `Client Secret` into the environment.

- **Microsoft (Outlook / Office 365)**

  1.  Azure Portal → App registrations → New registration.
  2.  Set supported account types and Redirect URI (Web): `https://mailauth.roastlang.wiki/callback`.
  3.  API permissions → add delegated permissions for Microsoft Graph Mail (e.g., `Mail.Read`, `Mail.Send`).
  4.  Certificates & secrets → New client secret → copy value.

- **Yahoo**

  1.  Yahoo Developer Network: https://developer.yahoo.com/apps/
  2.  Create an app, set Redirect URI(s) and mail permissions.
  3.  Copy `Client ID` and `Client Secret`.

- **AOL**

  - AOL may use Yahoo’s developer systems or separate registration depending on account. If a separate AOL registration is required, follow AOL developer docs and copy credentials. If uncertain, try Yahoo app + AOL endpoint mapping.

- **Yandex**

  1.  https://oauth.yandex.com/ → create app (Web services).
  2.  Set Redirect URI(s) and enable Mail scopes.
  3.  Copy Client ID/Secret.

- **Zoho**

  1.  https://api-console.zoho.com/ → Add Client ID → select server-based/webapp flow.
  2.  Set Client Domain and Redirect URIs.
  3.  Copy Client ID/Secret.

- **Mail.ru**
  1.  https://api.mail.ru/sites/my/ → register site/app.
  2.  Follow their verification process (sometimes requires `receiver.html` hosting).
  3.  Copy ID and Secret, and verify that mail scopes are approved.

## Required scopes and notes

- Google: `https://mail.google.com/` (full), or more limited `https://www.googleapis.com/auth/gmail.readonly`.
- Microsoft: Graph API mail scopes like `Mail.Read`, `Mail.Send` (delegated).
- Yahoo/AOL/Yandex/Zoho/Mail.ru: use provider-specific mail scopes — the app UI will show which permission to request.

Always request the minimum scopes you need.

## Redirect URI examples

- Hosted public instance: `https://mailauth.roastlang.wiki/callback`
- Production (Cloudflare Workers self-hosted): `https://<your-worker-subdomain>.workers.dev/callback`
- Custom domain: `https://auth.example.com/callback`
- Local dev: `http://localhost:8787/callback`

Ensure each provider's app settings include the exact URI used by your deployment. Trailing slashes and `http` vs `https` must match.

## Using Cloudflare Workers (wrangler)

- Add secrets:

```bash
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
# Repeat for each provider you enable
```

- Create a KV namespace for sessions (if used by the project):

```bash
npx wrangler kv:namespace create SESSIONS
# Then add the namespace id to `wrangler.toml`
```

## Local development

- Copy `.env.example` to `.env` and fill test credentials (use test client or temporary app). For Cloudflare Workers local emulation, use `wrangler dev` and the `http://localhost:8787/callback` redirect URI in your provider app.

```bash
cp .env.example .env
npm install
npm run dev   # or npx wrangler dev
```

Some providers (Google) require HTTPS for redirect URIs for production apps — use local testing redirect URIs only when the provider allows them.

## Testing the flow and verification

- Initiate an OAuth flow from the app (e.g., `POST /initiate` with an email). You should receive `auth_url` in response.
- Open the `auth_url` in a browser to complete consent and authenticate. The provider will redirect to the callback with a code.
- Poll `GET /poll/:session_id` (or the project’s equivalent) to check for completed authentication and to receive tokens.

Example curl-based sanity check (replace values appropriately):

```bash
curl -X POST https://mailauth.roastlang.wiki/initiate \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com"}'
```

If your worker responds with an `auth_url`, opening that in a browser should show the provider consent screen.

## Common errors and fixes

- **redirect_uri_mismatch**: The Redirect URI in the provider app doesn't match the URI used in the request. Fix by updating the provider app settings or your app's callback URL.
- **invalid_client / unauthorized_client**: Client ID/Secret wrong or not enabled for the requested flow. Re-check credentials and ensure the client type matches (web app vs native).
- **invalid_scope**: You requested scopes the app isn't allowed to request. Adjust requested scopes in provider app and in code.
- **consent screen not published** (Google): If not published and using External, add test users or publish the consent screen.

## Security best practices

- **Never** commit real secrets to the repository. Add `.env` to `.gitignore`.
- Use host-managed secrets in production (Cloudflare secrets, Vercel/Netlify environment variables, etc.).
- Rotate client secrets periodically and after any suspected exposure.
- Limit scopes and use incremental authorization if supported.

## Checklist before deploying

- [ ] All required provider client IDs and secrets set as secrets or env variables.
- [ ] Redirect URIs added to each provider app exactly as used by your deployment.
- [ ] KV namespace or session store configured (if required).
- [ ] Consent screens configured and test users added (if app is not published).

## Troubleshooting tips & logs

- Check Worker logs (or hosting logs) for errors during callback handling or token exchange.
- If token exchange fails, copy the exact provider error and lookup the provider-specific docs.

---
