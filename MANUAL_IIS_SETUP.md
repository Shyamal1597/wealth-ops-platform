# Manual IIS Setup Guide

## ⚠️ Critical Issue Detected

The automated setup detected that **iisnode is NOT installed** on your system. This is required for hosting Node.js applications on IIS.

## 📥 Step 1: Install iisnode (REQUIRED)

### Download iisnode

1. Go to: https://github.com/Azure/iisnode/releases
2. Download the latest release:
   - For 64-bit Windows: `iisnode-full-v0.2.26-x64.msi` (or latest version)
   - For 32-bit Windows: `iisnode-full-v0.2.26-x86.msi`

### Install iisnode

1. Double-click the downloaded `.msi` file
2. Follow the installation wizard
3. Accept defaults
4. Click "Install"
5. Wait for completion
6. Click "Finish"
7. **Restart your computer** (important!)

## 🔧 Step 2: Manual IIS Configuration

After installing iisnode and restarting, follow these steps:

### A. Open IIS Manager

1. Press `Win + R`
2. Type: `inetmgr`
3. Press Enter

### B. Create Application Pool

1. In left panel, expand your server name
2. Click "Application Pools"
3. In right panel, click "Add Application Pool..."
4. Settings:
   - **Name**: `SunidhiAppPool`
   - **.NET CLR version**: `No Managed Code`
   - **Managed pipeline mode**: `Integrated`
5. Click "OK"

### C. Create Website

1. In left panel, right-click "Sites"
2. Select "Add Website..."
3. Fill in:
   - **Site name**: `Sunidhi`
   - **Application pool**: Click "Select..." → Choose "SunidhiAppPool"
   - **Physical path**: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs`
   - **Binding**:
     - Type: `http`
     - IP address: `All Unassigned`
     - Port: `80`
     - Host name: `sunidhinew.com`
4. Click "OK"

### D. Set Folder Permissions

1. Open Windows Explorer
2. Navigate to: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs`
3. Right-click the folder → Properties
4. Go to "Security" tab
5. Click "Edit..."
6. Click "Add..."
7. Type: `IIS_IUSRS` → Click "Check Names" → Click "OK"
8. Give "Read & Execute" permissions
9. Click "Apply"
10. Repeat steps 6-9 for: `IUSR`
11. Repeat steps 6-9 for: `IIS APPPOOL\SunidhiAppPool`
    - Give this one "Modify" permissions
12. Click "OK"

### E. Configure Windows Firewall

1. Press `Win + R`
2. Type: `wf.msc`
3. Press Enter
4. Click "Inbound Rules" in left panel
5. Click "New Rule..." in right panel
6. Choose "Port" → Next
7. Choose "TCP"
8. Specific local ports: `80`
9. Next
10. Choose "Allow the connection" → Next
11. Check all (Domain, Private, Public) → Next
12. Name: `IIS HTTP Traffic`
13. Click "Finish"

### F. Verify web.config

Make sure `web.config` exists in `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs`

It should contain configuration for iisnode. (Already created ✓)

### G. Start the Website

1. In IIS Manager, select "Sunidhi" site
2. In right panel, click "Start"
3. Status should change to "Started"

## ✅ Step 3: Test the Deployment

### On the Server

1. Open browser
2. Go to: `http://localhost`
3. Should show Sunidhi website

If it doesn't work:
1. Go to: `http://localhost:80`
2. Or try: `http://127.0.0.1`

### Check for Errors

If you see errors:

1. Check iisnode logs:
   - Location: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\iisnode`
2. Check Event Viewer:
   - Press `Win + R`
   - Type: `eventvwr`
   - Go to: Windows Logs → Application
   - Look for errors from IIS or iisnode

## 🌐 Step 4: Configure Client Access

Your server IP is: **172.29.240.1**

### Option A: Hosts File (Quick Test)

On EACH colleague's computer:

1. Run Notepad as Administrator
2. Open: `C:\Windows\System32\drivers\etc\hosts`
3. Add line at end:
   ```
   172.29.240.1   sunidhinew.com
   ```
4. Save and close

### Option B: DNS (Recommended)

Contact your network administrator:
- Create DNS A record
- Name: `sunidhinew` or `sunidhinew.com`
- Points to: `172.29.240.1`

## 🔍 Troubleshooting Common Issues

### Issue: "iisnode encountered an error"

**Cause**: Node.js not found or not in PATH

**Solution**:
1. Open Command Prompt as Admin
2. Run: `where node`
3. Should show path like `C:\Program Files\nodejs\node.exe`
4. If not found, reinstall Node.js
5. Make sure to check "Add to PATH" during installation

### Issue: "HTTP Error 500.19"

**Cause**: web.config syntax error or missing URL Rewrite

**Solution**:
1. Install IIS URL Rewrite Module
2. Download: https://www.iis.net/downloads/microsoft/url-rewrite
3. Restart IIS: Run `iisreset` in Command Prompt as Admin

### Issue: "HTTP Error 503"

**Cause**: Application Pool stopped

**Solution**:
1. Open IIS Manager
2. Go to Application Pools
3. Find "SunidhiAppPool"
4. Right-click → Start

### Issue: Site loads but shows directory listing

**Cause**: web.config or server.js not found

**Solution**:
1. Verify files exist in site root:
   - web.config ✓
   - server.js ✓
2. Check file permissions
3. Restart IIS: `iisreset`

## 📝 Quick Commands

```batch
# Restart IIS
iisreset

# Check if IIS is running
net start w3svc

# View Node.js processes
tasklist | findstr node.exe

# Kill Node.js processes if stuck
taskkill /F /IM node.exe

# Test website from command line
curl http://localhost
curl http://sunidhinew.com

# Flush DNS cache
ipconfig /flushdns
```

## 🎯 Verification Checklist

Before testing with colleagues:

- [ ] iisnode installed and computer restarted
- [ ] IIS URL Rewrite Module installed
- [ ] Application Pool created (SunidhiAppPool)
- [ ] Website created (Sunidhi)
- [ ] Folder permissions set correctly
- [ ] Windows Firewall rule added for port 80
- [ ] web.config exists in site root
- [ ] server.js exists in site root
- [ ] Site is "Started" in IIS Manager
- [ ] Can access http://localhost on server
- [ ] No errors in iisnode logs

## 📞 Need More Help?

If you're still having issues:

1. Check iisnode logs: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\iisnode`
2. Check Windows Event Viewer (Application logs)
3. See: `IIS_DEPLOYMENT_GUIDE.md` for detailed troubleshooting
4. See: `QUICK_START_GUIDE.txt` for step-by-step instructions

## 🔄 Alternative: Use Node.js Directly (Temporary)

If IIS setup is too complex, you can temporarily run the site using Node.js directly:

```batch
cd C:\Users\SSFL-RETAIL-017\sunidhi-nextjs
npm run start
```

This will start the site on port 3000:
- Access: http://localhost:3000

To make it accessible to colleagues:
1. Configure Windows Firewall for port 3000
2. They access: http://<YOUR-IP>:3000

**Note**: This requires keeping the Command Prompt window open.

## ✨ Summary

The main blocker was **iisnode not being installed**. Once you:

1. ✅ Install iisnode
2. ✅ Restart computer
3. ✅ Follow manual IIS setup steps above

Your site will be accessible as http://sunidhinew.com

Good luck! 🚀
