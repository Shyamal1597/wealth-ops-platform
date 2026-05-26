# HTTPS Setup Guide for Production

This guide explains how to setup FREE HTTPS certificates using Let's Encrypt for your Sunidhi Securities website.

## ⚠️ IMPORTANT SECURITY REQUIREMENT

**HTTPS is MANDATORY for production** because:
- Firebase Phone Authentication requires HTTPS
- Sensitive data (passwords, OTP tokens) must be encrypted in transit
- Browser security features (Secure cookies, Service Workers) require HTTPS
- SEO and user trust depend on HTTPS

---

## Prerequisites

1. ✅ Domain name pointing to your server (e.g., sunidhi.com)
2. ✅ Server with root/sudo access (Ubuntu/Debian recommended)
3. ✅ Ports 80 and 443 open in firewall
4. ✅ Next.js application deployed and running

---

## Option 1: Using Certbot (Recommended - Easiest)

### Step 1: Install Certbot

```bash
# For Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# For CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

### Step 2: Stop Next.js (temporarily)

```bash
# Stop your Next.js process
pm2 stop all  # If using PM2
# OR
kill -9 $(lsof -t -i:80)  # If running on port 80
```

### Step 3: Obtain SSL Certificate

```bash
# Replace with your actual domain
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter your email address
# - Agree to Terms of Service
# - Choose whether to share email with EFF
```

### Step 4: Verify Certificate Files

```bash
# Certificates will be saved in:
ls -la /etc/letsencrypt/live/yourdomain.com/

# You should see:
# - cert.pem (Your certificate)
# - chain.pem (Intermediate certificates)
# - fullchain.pem (cert.pem + chain.pem)
# - privkey.pem (Private key - KEEP SECRET!)
```

### Step 5: Setup Auto-Renewal

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Setup auto-renewal (runs twice daily)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check status
sudo systemctl status certbot.timer
```

---

## Option 2: Using Nginx Reverse Proxy (Production Recommended)

### Step 1: Install Nginx

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 2: Configure Nginx

Create Nginx config file:

```bash
sudo nano /etc/nginx/sites-available/sunidhi
```

Add this configuration:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Certbot validation
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates (will be created by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Reverse Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 3: Enable Configuration

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sunidhi /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# If OK, reload Nginx
sudo systemctl reload nginx
```

### Step 4: Get SSL Certificate with Nginx

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will:
- Automatically obtain certificates
- Update Nginx configuration
- Setup auto-renewal

---

## Option 3: Using PM2 with HTTPS Module (Alternative)

### Step 1: Install PM2 HTTPS Module

```bash
npm install -g pm2
npm install https fs
```

### Step 2: Create HTTPS Server File

Create `server.js` in your project root:

```javascript
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const { createServer: createHttpServer } = require('http');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const httpsPort = 443;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // HTTP Server (redirect to HTTPS)
  createHttpServer((req, res) => {
    const url = 'https://' + req.headers.host + req.url;
    res.writeHead(301, { Location: url });
    res.end();
  }).listen(80);

  // HTTPS Server
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem'),
  };

  createServer(httpsOptions, async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  }).listen(httpsPort);

  console.log(
    `> Server ready - HTTPS on https://${hostname}:${httpsPort}`
  );
});
```

### Step 3: Run with PM2

```bash
pm2 start server.js --name sunidhi-https
pm2 save
pm2 startup  # Follow the instructions
```

---

## Post-Installation Steps

### 1. Update Environment Variables

Edit `.env.local`:

```bash
# In production
NODE_ENV=production
FORCE_HTTPS=true
```

### 2. Update Next.js Config

The `next.config.ts` will automatically enforce HTTPS headers (already configured).

### 3. Test HTTPS

```bash
# Check SSL certificate
curl -I https://yourdomain.com

# Test with SSL Labs (comprehensive check)
# Visit: https://www.ssllabs.com/ssltest/
# Enter your domain and click "Submit"
```

### 4. Verify Auto-Renewal

```bash
# List renewal timer
sudo systemctl list-timers certbot.timer

# Manual renewal test
sudo certbot renew --dry-run
```

---

## Firebase Configuration Updates

After HTTPS is enabled:

1. **Update Firebase Console:**
   - Go to Firebase Console > Authentication > Settings
   - Add your production domain to "Authorized domains"
   - Example: `https://yourdomain.com`

2. **Update Auth Domain:**
   ```bash
   # In .env.local
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourdomain.com
   ```

---

## Troubleshooting

### Certificate Renewal Failed

```bash
# Check logs
sudo journalctl -u certbot.timer

# Manual renewal
sudo certbot renew --force-renewal
```

### Port 80/443 Already in Use

```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :443

# Kill if necessary
sudo kill -9 <PID>
```

### Nginx Configuration Error

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Security Checklist

- ✅ HTTPS enabled with valid Let's Encrypt certificate
- ✅ HTTP to HTTPS redirect configured
- ✅ Auto-renewal setup and tested
- ✅ Security headers configured (HSTS, X-Frame-Options, etc.)
- ✅ TLS 1.2+ only (no SSL/TLS 1.0/1.1)
- ✅ Strong cipher suites configured
- ✅ Firebase authorized domains updated
- ✅ Firewall allows ports 80 and 443
- ✅ SSL certificate tested with SSL Labs (A+ rating)

---

## Certificate Renewal Schedule

Let's Encrypt certificates are valid for **90 days**.

Certbot automatically renews certificates when they have **30 days or less** remaining.

**No manual intervention needed!** ✅

---

## Cost

**100% FREE** - Let's Encrypt provides free SSL/TLS certificates forever.

No hidden costs, no premium tiers, completely free! 🎉

---

## Support

For issues with:
- **Let's Encrypt:** https://community.letsencrypt.org/
- **Certbot:** https://certbot.eff.org/help/
- **Nginx:** https://www.nginx.com/resources/wiki/community/

---

**Last Updated:** January 2026
**Maintained by:** Sunidhi Securities Development Team
