import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { logger } from 'hono/logger'
import { homePage, successPage } from './ui'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', secureHeaders())
app.use('/*', cors({
    origin: '*',
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    maxAge: 600,
}))

// UI Routes
app.get('/', (c) => c.html(homePage()))

// Helper to generate random string
function generateId(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
        result += chars.charAt(randomValues[i] % chars.length);
    }
    return result
}

// Provider Config
const getProviderConfig = (env, providerName) => {
    const configs = {
        google: {
            authorize_url: "https://accounts.google.com/o/oauth2/v2/auth",
            token_url: "https://oauth2.googleapis.com/token",
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            scopes: ["https://mail.google.com/"],
            params: { access_type: "offline", prompt: "consent" },
            auth_method: "body"
        },
        microsoft: {
            authorize_url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
            token_url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            client_id: env.MICROSOFT_CLIENT_ID,
            client_secret: env.MICROSOFT_CLIENT_SECRET,
            scopes: [
                "https://outlook.office.com/IMAP.AccessAsUser.All",
                "https://outlook.office.com/SMTP.Send",
                "offline_access"
            ],
            params: { response_mode: "query" },
            auth_method: "body"
        },
        yahoo: {
            authorize_url: "https://api.login.yahoo.com/oauth2/request_auth",
            token_url: "https://api.login.yahoo.com/oauth2/get_token",
            client_id: env.YAHOO_CLIENT_ID,
            client_secret: env.YAHOO_CLIENT_SECRET,
            scopes: ["mail-r"],
            params: {},
            auth_method: "header"
        },
        aol: {
            authorize_url: "https://api.login.aol.com/oauth2/request_auth",
            token_url: "https://api.login.aol.com/oauth2/get_token",
            client_id: env.AOL_CLIENT_ID,
            client_secret: env.AOL_CLIENT_SECRET,
            scopes: ["mail-r"],
            params: {},
            auth_method: "header"
        },
        yandex: {
            authorize_url: "https://oauth.yandex.com/authorize",
            token_url: "https://oauth.yandex.com/token",
            client_id: env.YANDEX_CLIENT_ID,
            client_secret: env.YANDEX_CLIENT_SECRET,
            scopes: [],
            params: {},
            auth_method: "body"
        },
        zoho: {
            authorize_url: "https://accounts.zoho.com/oauth/v2/auth",
            token_url: "https://accounts.zoho.com/oauth/v2/token",
            client_id: env.ZOHO_CLIENT_ID,
            client_secret: env.ZOHO_CLIENT_SECRET,
            scopes: ["ZohoMail.accounts.ALL", "ZohoMail.messages.ALL", "ZohoMail.folders.ALL"],
            params: { access_type: "offline" },
            auth_method: "body"
        },
        mailru: {
            authorize_url: "https://oauth.mail.ru/login",
            token_url: "https://oauth.mail.ru/token",
            client_id: env.MAILRU_CLIENT_ID,
            client_secret: env.MAILRU_CLIENT_SECRET,
            scopes: ["userinfo", "mail.imap"],
            params: {},
            auth_method: "body"
        }
    }
    return configs[providerName] || null
}

app.post('/initiate', async (c) => {
    let body;
    try {
        body = await c.req.json();
    } catch (e) {
        return c.json({ error: "Invalid JSON" }, 400);
    }

    const { email, provider } = body;

    if (!email || !provider) {
        return c.json({ error: "Missing email or provider" }, 400);
    }

    if (!getProviderConfig(c.env, provider)) {
        return c.json({ error: "Provider not supported" }, 400);
    }

    const sessionId = generateId();

    const sessionData = {
        id: sessionId,
        email,
        provider,
        status: 'pending',
        created_at: Date.now()
    };

    await c.env.SESSIONS.put(sessionId, JSON.stringify(sessionData), { expirationTtl: 600 });

    const urlObj = new URL(c.req.url);
    const finalAuthUrl = `${urlObj.origin}/login/${sessionId}`;

    return c.json({
        session_id: sessionId,
        auth_url: finalAuthUrl
    });
})

app.get('/login/:sessionId', async (c) => {
    const sessionId = c.req.param('sessionId');
    const sessionStr = await c.env.SESSIONS.get(sessionId);

    if (!sessionStr) return c.text("Invalid or expired session", 404);

    const session = JSON.parse(sessionStr);
    const config = getProviderConfig(c.env, session.provider);

    const redirectUri = new URL(c.req.url).origin + '/callback';
    const state = sessionId;

    const params = new URLSearchParams({
        client_id: config.client_id,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: config.scopes.join(' '),
        state: state,
        ...config.params
    });

    return c.redirect(`${config.authorize_url}?${params.toString()}`);
})

app.get('/callback', async (c) => {
    const code = c.req.query('code');
    const state = c.req.query('state');

    if (!code || !state) return c.text("Missing code or state", 400);

    const sessionStr = await c.env.SESSIONS.get(state);
    if (!sessionStr) return c.text("Invalid session state", 400);

    const session = JSON.parse(sessionStr);
    const config = getProviderConfig(c.env, session.provider);
    const redirectUri = new URL(c.req.url).origin + '/callback';

    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    let bodyParams = {
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
    };

    if (config.auth_method === 'header') {
        const auth = btoa(`${config.client_id}:${config.client_secret}`);
        headers['Authorization'] = `Basic ${auth}`;
    } else {
        bodyParams['client_id'] = config.client_id;
        bodyParams['client_secret'] = config.client_secret;
    }

    try {
        const tokenResp = await fetch(config.token_url, {
            method: 'POST',
            headers: headers,
            body: new URLSearchParams(bodyParams)
        });

        if (!tokenResp.ok) {
            const errText = await tokenResp.text();
            console.error("Token exchange failed:", errText);
            return c.text(`Token exchange failed: ${errText}`, 500);
        }

        const tokens = await tokenResp.json();

        session.access_token = tokens.access_token;
        session.refresh_token = tokens.refresh_token;
        session.expires_at = (Date.now() / 1000) + (tokens.expires_in || 3600);
        session.status = 'authenticated';

        await c.env.SESSIONS.put(state, JSON.stringify(session), { expirationTtl: 3600 });

        return c.html(successPage());
    } catch (err) {
        console.error("Callback error:", err);
        return c.text("Internal Server Error", 500);
    }
})

app.get('/poll/:sessionId', async (c) => {
    const sessionId = c.req.param('sessionId');
    const sessionStr = await c.env.SESSIONS.get(sessionId);

    if (!sessionStr) return c.json({ error: "Invalid session" }, 404);

    const session = JSON.parse(sessionStr);

    if (session.status !== 'authenticated') {
        return c.json({ status: 'pending' });
    }

    return c.json({
        status: 'authenticated',
        email: session.email,
        provider: session.provider,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at
    });
})

app.post('/refresh', async (c) => {
    let body;
    try {
        body = await c.req.json();
    } catch (e) {
        return c.json({ error: "Invalid JSON" }, 400);
    }

    const { refresh_token, provider } = body;

    if (!refresh_token || !provider) {
        return c.json({ error: "Missing refresh_token or provider" }, 400);
    }

    const config = getProviderConfig(c.env, provider);

    if (!config) return c.json({ error: "Provider not supported" }, 400);

    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    let bodyParams = {
        refresh_token: refresh_token,
        grant_type: 'refresh_token'
    };

    if (config.auth_method === 'header') {
        const auth = btoa(`${config.client_id}:${config.client_secret}`);
        headers['Authorization'] = `Basic ${auth}`;
    } else {
        bodyParams['client_id'] = config.client_id;
        bodyParams['client_secret'] = config.client_secret;
    }

    try {
        const tokenResp = await fetch(config.token_url, {
            method: 'POST',
            headers: headers,
            body: new URLSearchParams(bodyParams)
        });

        if (!tokenResp.ok) return c.json({ error: "Refresh failed" }, 400);

        return c.json(await tokenResp.json());
    } catch (err) {
        console.error("Refresh error:", err);
        return c.json({ error: "Internal Server Error" }, 500);
    }
})

export default app
