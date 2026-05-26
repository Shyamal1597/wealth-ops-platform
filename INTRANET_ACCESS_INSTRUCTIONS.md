# How to Enable Intranet Access for Your Colleagues

Your website is currently running on Next.js dev server (port 3000) and accessible at:
- **http://192.168.48.102:3000** ✅ Working now

To make it accessible without the port number (so colleagues can use **http://192.168.48.102**), you need to configure IIS as a reverse proxy.

## Quick Fix (Immediate Solution)

Tell your colleagues to access:
```
http://192.168.48.102:3000
```

This works immediately and requires no additional setup!

## Permanent Fix (Remove :3000 from URL)

To make **http://192.168.48.102** work (without :3000), follow these steps:

### Step 1: Run Setup Script as Administrator

1. Navigate to: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs`
2. Right-click on **`SETUP_INTRANET_ACCESS.bat`**
3. Select **"Run as administrator"**
4. Click **"Yes"** when prompted by UAC
5. Follow the on-screen instructions

### Step 2: Verify It Works

Open a browser and test these URLs (without :3000):
- http://192.168.48.102
- http://192.168.48.102/about/story
- http://192.168.48.102/legal/disclosure-disclaimer

### Step 3: Share with Colleagues

Once verified, tell your colleagues they can now access:
```
http://192.168.48.102
```

## What the Setup Script Does

1. **Copies PDF files** to `C:\inetpub\wwwroot\legal-documents\`
   - This allows IIS to serve PDFs directly

2. **Configures IIS reverse proxy**
   - Copies `web.config` to IIS wwwroot
   - Sets up rules to forward all requests to Next.js on port 3000
   - PDFs are served directly from IIS for better performance

## Important Notes

- **Next.js MUST be running** on port 3000 for this to work
- If you restart your computer, you need to run `npm run dev` again
- The IIS configuration persists across restarts
- PDFs only need to be copied once

## Troubleshooting

### If http://192.168.48.102 shows an error:

1. Check that Next.js is running:
   ```bash
   cd C:\Users\SSFL-RETAIL-017\sunidhi-nextjs
   npm run dev
   ```

2. Verify it shows:
   ```
   - Local:        http://localhost:3000
   - Network:      http://192.168.48.102:3000
   ```

3. Test that port 3000 works:
   ```
   http://192.168.48.102:3000
   ```

4. If port 3000 works but port 80 doesn't, re-run the setup script as administrator

### If colleagues can't access the site:

1. Check Windows Firewall settings
2. Ensure port 80 is allowed for incoming connections
3. Verify your IP hasn't changed (check with `ipconfig`)

## How to Start Website After Restart

Every time you restart your computer:

1. Open Command Prompt or PowerShell
2. Run these commands:
   ```bash
   cd C:\Users\SSFL-RETAIL-017\sunidhi-nextjs
   npm run dev
   ```

3. Keep the window open (don't close it)
4. Website is now accessible at http://192.168.48.102

## Technical Details

**Current Setup:**
- Next.js dev server runs on port 3000
- IIS runs on port 80 (default HTTP port)
- IIS acts as reverse proxy, forwarding requests to Next.js

**Why This Approach:**
- Port 80 doesn't need to be specified in URLs (http://192.168.48.102 instead of http://192.168.48.102:3000)
- PDFs are served efficiently by IIS
- Next.js handles all dynamic content
- Easy to maintain and debug

**Files Created:**
- `IIS-web.config` - IIS configuration template
- `SETUP_INTRANET_ACCESS.bat` - Automated setup script
- `INTRANET_ACCESS_INSTRUCTIONS.md` - This document
