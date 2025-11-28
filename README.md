# MailAuth

<div align="center">

![MailAuth Banner](images/image.png)

**The Universal OAuth2 Layer for Email Applications**

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/swadhinbiswas/mailauth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

**MailAuth** is a secure, serverless authentication layer designed to simplify OAuth2 integration for TUI, CLI, and Desktop email clients. It acts as a centralized proxy, handling the complex OAuth dance and keeping your Client Secrets safe, so your application only ever deals with access tokens.

## 🚀 Features

- **🔐 Secure by Design**: Client Secrets are stored securely on the server (Cloudflare Workers), never embedded in your app.
- **🌍 Multi-Provider Support**: Out-of-the-box support for:
  - Google (Gmail)
  - Microsoft (Outlook, Office 365)
  - Yahoo
  - AOL
  - Yandex
  - Zoho
  - Mail.ru
- **⚡ Serverless & Fast**: Built on **Cloudflare Workers** for zero cold starts, global low latency, and infinite scalability.
- **🎨 Premium UI**: Includes a beautiful, dark-themed landing page with an interactive demo and documentation.
- **🛠️ Zero Config Client**: Auto-discovery logic detects the provider from the email address.

## 🛠️ Quick Start

### Option 1: Use the Hosted Instance

You can use our public instance to test your application immediately:
`https://mailauth.swadhin.workers.dev`

### Option 2: Self-Host (Recommended)

Deploy your own instance for full control over data and rate limits.

1.  **Clone the repo**

    ```bash
    git clone https://github.com/swadhinbiswas/mailauth.git
    cd mailauth
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Secrets**
    Obtain Client IDs and Secrets for the providers you want to support, then set them in Cloudflare:

        <details>
        <summary><strong>📚 How to Get OAuth Credentials (Click to Expand)</strong></summary>

        ### 1. Google
        1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
        2.  Create a new project.
        3.  Go to **APIs & Services > Library** and enable the **Gmail API**.
        4.  Go to **APIs & Services > OAuth consent screen**.
            -   Select **External**.
            -   Fill in required details.
            -   Add scope: `https://mail.google.com/`.
            -   Add test users (your email).
        5.  Go to **APIs & Services > Credentials**.
            -   **Create Credentials > OAuth client ID**.
            -   Application type: **Web application**.
            -   **Authorized redirect URIs**: `https://your-worker-url.workers.dev/callback` (or `http://localhost:8787/callback` for local testing).
        6.  Copy the Client ID and Client Secret.

        ### 2. Microsoft (Outlook / Office 365)
        1.  Go to the [Azure Portal](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).
        2.  Click **New registration**.
            -   Name: `MailAuth`
            -   Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**.
            -   Redirect URI: **Web** -> `https://your-worker-url.workers.dev/callback`.
        3.  Copy the **Application (client) ID**.
        4.  Go to **Certificates & secrets > Client secrets**.
            -   Click **New client secret**.
            -   Copy the **Value** (not the Secret ID).

        ### 3. Yahoo
        1.  Go to the [Yahoo Developer Network](https://developer.yahoo.com/apps/).
        2.  Click **Create an App**.
            -   Application Name: `MailAuth`
            -   Redirect URI(s): `https://your-worker-url.workers.dev/callback`.
            -   API Permissions: **Mail (Read/Write)**.
        3.  Create the app and copy the Client ID and Client Secret.

        ### 4. AOL
        1.  Go to [AOL Developer](https://developer.aol.com/).
        2.  *Note: AOL is now part of Yahoo/Verizon. You may need to use the Yahoo Developer Network or specific AOL Oauth endpoints depending on your account type. Often, Yahoo credentials work for AOL if configured correctly, but check for a specific AOL App creation flow if available.*
        3.  If using Yahoo Dev Network, follow Yahoo steps but look for AOL specific scopes if listed.

        ### 5. Yandex
        1.  Go to [Yandex OAuth](https://oauth.yandex.com/).
        2.  Click **Create new client**.
            -   Name: `MailAuth`
            -   Platforms: **Web services**.
            -   Redirect URI: `https://your-worker-url.workers.dev/callback`.
            -   Permissions: **Mail API** -> `Read and send emails` (or similar).
        3.  Create and copy Client ID and Client Secret.

        ### 6. Zoho
        1.  Go to the [Zoho Developer Console](https://api-console.zoho.com/).
        2.  Click **Add Client ID**.
        3.  Client Name: `MailAuth`.
        4.  Client Domain: `your-website.com` (or placeholder).
        5.  Authorized Redirect URIs: `https://your-worker-url.workers.dev/callback`.
        6.  Copy Client ID and Client Secret.

        ### 7. Mail.ru
        1.  Go to [Mail.ru for Developers](https://api.mail.ru/sites/my/).
        2.  Create a new site/app.
        3.  Download the `receiver.html` file and host it (or follow their verification process).
        4.  Once verified, go to settings to find ID and Secret.
        5.  *Note: Mail.ru access often requires approval for IMAP scopes.*

        </details>

        ```bash
        npx wrangler secret put GOOGLE_CLIENT_ID
        npx wrangler secret put GOOGLE_CLIENT_SECRET
        # Repeat for other providers...
        ```

4.  **Create Session Storage**

    ```bash
    npx wrangler kv:namespace create SESSIONS
    # Update wrangler.toml with the ID returned
    ```

5.  **Deploy**
    ```bash
    npm run deploy
    ```

## 📖 API Reference

### 1. Initiate Login

Starts the OAuth flow.

- **Endpoint**: `POST /initiate`
- **Body**:
  ```json
  {
    "email": "user@gmail.com",
    "provider": "google" // Optional, auto-detected if omitted
  }
  ```
- **Response**:
  ```json
  {
    "session_id": "random_session_id",
    "auth_url": "https://..."
  }
  ```

### 2. Poll Status

Checks if the user has completed the login.

- **Endpoint**: `GET /poll/:session_id`
- **Response (Pending)**: `{"status": "pending"}`
- **Response (Success)**:
  ```json
  {
    "status": "authenticated",
    "access_token": "...",
    "refresh_token": "...",
    "expires_at": 1700000000
  }
  ```

### 3. Refresh Token

Refreshes an expired access token.

- **Endpoint**: `POST /refresh`
- **Body**:
  ```json
  {
    "refresh_token": "...",
    "provider": "google"
  }
  ```

## 💻 Local Development

1.  **Start the dev server**
    ```bash
    npm run dev
    ```
2.  Open `http://localhost:8787` to see the UI.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📦 Environment variables

Detailed environment-variable and OAuth credential instructions are available in `docs/ENVIRONMENT.md`.

- **Copy example:** `cp .env.example .env` and fill values.
- **Or use Cloudflare secrets:** `npx wrangler secret put <KEY>` for each credential.
