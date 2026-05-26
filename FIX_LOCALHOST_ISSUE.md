# How to Fix the Localhost Issue

## What Happened?

After copying the PDFs to IIS, localhost stopped working because:
- IIS is on port 80 (http://localhost)
- Next.js is on port 3000 (http://localhost:3000)
- They need to be connected via a reverse proxy

## QUICK FIX - Use Port 3000 (EASIEST)

**Simply access your website on port 3000 instead:**

```
http://localhost:3000
```

This is where Next.js is actually running! All pages will work, including the PDF downloads (Next.js serves files from the `public` folder).

## Full Fix - Configure IIS as Reverse Proxy (If you need port 80)

If you specifically need http://localhost (port 80) to work, follow these steps:

### Step 1: Run Setup Script as Administrator

1. Go to: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs`
2. Right-click on `SETUP_IIS_PROXY.bat`
3. Select "Run as administrator"
4. Click "Yes" when prompted

### Step 2: Install IIS URL Rewrite Module (If not installed)

1. Download from: https://www.iis.net/downloads/microsoft/url-rewrite
2. Install the module
3. Restart IIS

### Step 3: Verify Setup

After setup, you should be able to access:
- http://localhost → proxies to Next.js
- http://localhost/legal/disclosure-disclaimer → works
- http://localhost/legal-documents/*.pdf → serves PDFs directly

## Current Status

✅ Next.js is running on http://localhost:3000
✅ PDFs are copied to C:\inetpub\wwwroot\legal-documents\
❌ IIS reverse proxy not configured (needs admin rights)

## Recommended Solution

**Use http://localhost:3000 for development**

This is the standard way to develop Next.js apps. All features will work including:
- All pages
- PDF downloads (served from public folder)
- API routes
- Hot reload

The PDF files in your Next.js public folder will work fine at:
- http://localhost:3000/legal-documents/*.pdf

You don't need IIS for development - it's only needed if you want to use port 80 specifically.

## Testing PDF Downloads

Once you're using http://localhost:3000, test these URLs:
- http://localhost:3000/legal/disclosure-disclaimer
- http://localhost:3000/legal/kyc-advisory
- http://localhost:3000/legal/investor-charter

All PDF download links should work!
