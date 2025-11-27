export const layout = (content, title = "MailAuth") => `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#3b82f6',
            secondary: '#10b981',
            dark: '#0f172a',
            darker: '#020617',
            card: '#1e293b',
            accent: '#8b5cf6'
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          animation: {
            'fade-in': 'fadeIn 0.6s ease-out forwards',
            'slide-up': 'slideUp 0.6s ease-out forwards',
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
            slideUp: {
              '0%': { transform: 'translateY(20px)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' },
            }
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    body { font-family: 'Inter', sans-serif; }
    
    .glass {
      background: rgba(30, 41, 59, 0.4);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .glass-card {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    .gradient-text {
      background: linear-gradient(to right, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #0f172a; 
    }
    ::-webkit-scrollbar-thumb {
      background: #334155; 
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #475569; 
    }
  </style>
</head>
<body class="bg-darker text-slate-200 min-h-screen flex flex-col selection:bg-primary/30 selection:text-white overflow-x-hidden">
  
  <!-- Navbar -->
  <nav class="fixed w-full z-50 glass border-b border-white/5 transition-all duration-300" id="navbar">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3 group cursor-pointer" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
          <div class="relative w-8 h-8">
            <div class="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative w-full h-full bg-darker rounded-lg flex items-center justify-center border border-white/10">
              <span class="font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">M</span>
            </div>
          </div>
          <span class="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">MailAuth</span>
        </div>
        
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-1">
            <a href="#features" class="hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-all">Features</a>
            <a href="#documentation" class="hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-all">Documentation</a>
            <a href="https://github.com/swadhinbiswas/mailauth" target="_blank" class="ml-4 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all border border-white/10">GitHub</a>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Content -->
  <main class="flex-grow pt-24 relative">
    <!-- Ambient Background -->
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" style="animation-delay: 2s;"></div>
    </div>
    
    ${content}
  </main>

  <!-- Footer -->
  <footer class="border-t border-white/5 bg-darker/50 backdrop-blur-sm py-12 mt-20">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <p class="text-gray-500 text-sm">
        &copy; ${new Date().getFullYear()} MailAuth. Open Source Universal OAuth2 Layer.
      </p>
    </div>
  </footer>

</body>
</html>
`

export const homePage = () => layout(`
  <!-- Hero Section -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      
      <!-- Left Column: Text -->
      <div class="text-left animate-slide-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          v1.0 Production Ready
        </div>

        <h1 class="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
          Universal Email <br/>
          <span class="gradient-text">OAuth2 Authentication</span>
        </h1>
        
        <p class="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl">
          The missing authentication layer for your TUI, CLI, and Desktop email apps. 
          Securely connect with Google, Microsoft, Yahoo, and more via a single, unified API.
        </p>

        <div class="flex flex-wrap gap-4">
          <a href="#documentation" class="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all hover:scale-105">
            Read Documentation
          </a>
          <a href="#features" class="px-6 py-3 text-gray-400 hover:text-white transition-colors">
            View Features ↓
          </a>
        </div>
      </div>

      <!-- Right Column: Auth Form -->
      <div class="relative animate-slide-up" style="animation-delay: 0.2s;">
        <div class="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-30"></div>
        <div class="glass-card p-8 rounded-2xl relative">
          <h2 class="text-2xl font-bold mb-2 text-white">Try it Live</h2>
          <p class="text-gray-400 text-sm mb-6">Enter your email to auto-detect provider and start the OAuth flow.</p>
          
          <form id="demoForm" class="space-y-5">
            <div>
              <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div class="relative group">
                <input type="email" id="email" required 
                  class="w-full bg-darker border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder-gray-600 text-white"
                  placeholder="name@example.com">
              </div>
            </div>
            
            <button type="submit" id="submitBtn"
              class="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
              Connect Account
            </button>
          </form>

          <!-- Status Messages -->
          <div id="errorMsg" class="mt-4 hidden p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-200 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span id="errorText"></span>
          </div>

          <div id="result" class="mt-4 hidden">
            <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/20 text-center">
              <p class="text-sm font-medium text-green-400 mb-2">Session Created</p>
              <a id="authLink" href="#" target="_blank" class="inline-block px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm font-medium transition-colors border border-green-500/20">
                Login with <span id="providerName" class="capitalize">Provider</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Features Section -->
  <div id="features" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold mb-4">Why MailAuth?</h2>
      <p class="text-gray-400">Built for developers who need email authentication without the headache.</p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors">
        <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-primary">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Secure Proxy</h3>
        <p class="text-gray-400 text-sm">Your Client Secrets stay safe on the server. The client only receives the tokens it needs.</p>
      </div>
      
      <div class="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors">
        <div class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 text-accent">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
        </div>
        <h3 class="text-xl font-bold mb-2">7+ Providers</h3>
        <p class="text-gray-400 text-sm">Google, Microsoft, Yahoo, AOL, Yandex, Zoho, and Mail.ru supported out of the box.</p>
      </div>

      <div class="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors">
        <div class="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 text-green-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Zero Config</h3>
        <p class="text-gray-400 text-sm">Auto-discovery logic detects the provider from the email address automatically.</p>
      </div>
    </div>
  </div>

  <!-- Documentation Section -->
  <div id="documentation" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
    <div class="grid lg:grid-cols-3 gap-12">
      
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="sticky top-24">
          <h2 class="text-2xl font-bold mb-6">Documentation</h2>
          <div class="space-y-2">
            <a href="#quick-start" class="block px-4 py-2 rounded-lg bg-white/5 text-white font-medium border-l-2 border-primary">Quick Start</a>
            <a href="#api-reference" class="block px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">API Reference</a>
            <a href="#self-hosting" class="block px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Self Hosting</a>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="lg:col-span-2 space-y-16">
        
        <!-- Quick Start -->
        <section id="quick-start">
          <h3 class="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <span class="text-primary">01.</span> Quick Start (Cloud)
          </h3>
          <p class="text-gray-400 mb-6">Use our hosted instance to get started immediately without deploying anything.</p>
          
          <div class="glass-card p-6 rounded-xl border border-white/10">
            <h4 class="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Python Example</h4>
            <pre class="bg-darker p-4 rounded-lg overflow-x-auto text-sm text-gray-300 font-mono border border-white/10"><code>import requests
import webbrowser
import time

# 1. Initiate Login
email = "user@gmail.com"
resp = requests.post("https://mailauth.swadhin.workers.dev/initiate", 
    json={"email": email, "provider": "google"})
data = resp.json()

# 2. Open Browser
print(f"Please login: {data['auth_url']}")
webbrowser.open(data['auth_url'])

# 3. Poll for Token
session_id = data['session_id']
while True:
    time.sleep(2)
    poll = requests.get(f"https://mailauth.swadhin.workers.dev/poll/{session_id}")
    if poll.json().get("status") == "authenticated":
        print("Success!", poll.json())
        break</code></pre>
          </div>
        </section>

        <!-- API Reference -->
        <section id="api-reference">
          <h3 class="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <span class="text-primary">02.</span> API Reference
          </h3>
          
          <div class="space-y-4">
            <div class="glass-card p-4 rounded-xl border border-white/10">
              <div class="flex items-center justify-between mb-2">
                <code class="text-sm font-bold text-green-400">POST /initiate</code>
              </div>
              <p class="text-sm text-gray-400 mb-2">Start auth flow. Returns <code class="text-white">session_id</code> and <code class="text-white">auth_url</code>.</p>
              <div class="bg-darker p-2 rounded text-xs font-mono text-gray-400">{"email": "...", "provider": "..."}</div>
            </div>

            <div class="glass-card p-4 rounded-xl border border-white/10">
              <div class="flex items-center justify-between mb-2">
                <code class="text-sm font-bold text-blue-400">GET /poll/:session_id</code>
              </div>
              <p class="text-sm text-gray-400">Check status. Returns tokens when <code class="text-white">status: "authenticated"</code>.</p>
            </div>

            <div class="glass-card p-4 rounded-xl border border-white/10">
              <div class="flex items-center justify-between mb-2">
                <code class="text-sm font-bold text-green-400">POST /refresh</code>
              </div>
              <p class="text-sm text-gray-400">Refresh an access token.</p>
              <div class="bg-darker p-2 rounded text-xs font-mono text-gray-400">{"refresh_token": "...", "provider": "..."}</div>
            </div>
          </div>
        </section>

        <!-- Self Hosting -->
        <section id="self-hosting">
          <h3 class="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <span class="text-primary">03.</span> Self Hosting
          </h3>
          <p class="text-gray-400 mb-6">Deploy to your own Cloudflare Workers account for full control.</p>
          
          <div class="glass-card p-6 rounded-xl border border-white/10">
            <ol class="list-decimal list-inside space-y-4 text-gray-300 text-sm">
              <li>Clone the repository.</li>
              <li>Install dependencies: <code class="bg-white/10 px-1 py-0.5 rounded">npm install</code></li>
              <li>Create a KV Namespace: <code class="bg-white/10 px-1 py-0.5 rounded">wrangler kv:namespace create SESSIONS</code></li>
              <li>Set your OAuth secrets (see <code class="bg-white/10 px-1 py-0.5 rounded">credentials.md</code>):
                <pre class="mt-2 bg-darker p-3 rounded-lg overflow-x-auto text-xs text-gray-400 font-mono border border-white/10"><code>wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
# ... etc</code></pre>
              </li>
              <li>Deploy: <code class="bg-white/10 px-1 py-0.5 rounded">wrangler deploy</code></li>
            </ol>
          </div>
        </section>

      </div>
    </div>
  </div>

  <script>
    // Demo Form Logic
    document.getElementById('demoForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const btn = document.getElementById('submitBtn');
      const errorDiv = document.getElementById('errorMsg');
      const resultDiv = document.getElementById('result');
      const errorText = document.getElementById('errorText');
      
      // Reset state
      errorDiv.classList.add('hidden');
      resultDiv.classList.add('hidden');
      btn.disabled = true;
      const originalBtnText = btn.innerHTML;
      btn.innerHTML = '<div class="flex items-center justify-center gap-2"><svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...</div>';

      // Simple provider detection
      let provider = 'google';
      const domain = email.split('@')[1] || '';
      if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live') || domain.includes('office')) provider = 'microsoft';
      if (domain.includes('yahoo')) provider = 'yahoo';
      if (domain.includes('aol')) provider = 'aol';
      if (domain.includes('yandex')) provider = 'yandex';
      if (domain.includes('zoho')) provider = 'zoho';
      if (domain.includes('mail.ru')) provider = 'mailru';

      try {
        const res = await fetch('/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, provider })
        });
        
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        
        resultDiv.classList.remove('hidden');
        const link = document.getElementById('authLink');
        const providerSpan = document.getElementById('providerName');
        
        link.href = data.auth_url;
        providerSpan.textContent = provider;
        
        // Auto open
        window.open(data.auth_url, '_blank');

      } catch (err) {
        errorDiv.classList.remove('hidden');
        errorText.textContent = err.message || 'Something went wrong';
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
      }
    });
  </script>
`)

export const successPage = () => layout(`
  <div class="min-h-[60vh] flex items-center justify-center animate-slide-up">
    <div class="max-w-md w-full mx-auto text-center">
      <div class="relative w-24 h-24 mx-auto mb-8">
        <div class="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div class="relative w-full h-full bg-darker rounded-full flex items-center justify-center border border-green-500/20 ring-4 ring-green-500/10">
          <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
      </div>
      
      <h1 class="text-4xl font-bold mb-4 text-white">Authentication Successful</h1>
      <p class="text-gray-400 mb-10 text-lg">You have successfully logged in. You can now close this window and return to your application.</p>
      
      <button onclick="window.close()" class="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-medium transition-all text-white hover:scale-105">
        Close Window
      </button>
    </div>
  </div>
`, "Success")
