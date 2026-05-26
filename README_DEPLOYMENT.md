# Sunidhi Website - IIS Deployment Package

## 🎯 Overview

This package contains everything needed to deploy the Sunidhi website to your internal IIS server, making it accessible to all colleagues on your office network as **http://sunidhinew.com**

## 📦 Package Contents

| File | Description |
|------|-------------|
| **QUICK_START_GUIDE.txt** | ⭐ **START HERE** - Simple step-by-step guide |
| **SETUP_IIS.bat** | 🚀 Automated setup script (Run as Admin) |
| **setup-iis.ps1** | PowerShell script for IIS configuration |
| **IIS_DEPLOYMENT_GUIDE.md** | Detailed technical documentation |
| **HOSTS_FILE_INSTRUCTIONS.txt** | Guide for colleagues to access the site |
| **web.config** | IIS configuration file |
| **server.js** | Node.js server for IIS |
| **README_DEPLOYMENT.md** | This file |

## ⚡ Quick Start (3 Steps)

### Step 1: Install Prerequisites (One-time)

Download and install these on your IIS server:

1. **IIS URL Rewrite Module**
   https://www.iis.net/downloads/microsoft/url-rewrite

2. **iisnode**
   https://github.com/Azure/iisnode/releases
   (Choose x64 or x86 based on your system)

3. **Verify Node.js** (already installed)
   ```
   node --version
   ```

### Step 2: Run Automated Setup

1. Right-click **SETUP_IIS.bat**
2. Select **"Run as Administrator"**
3. Follow the prompts
4. Note the server IP address shown at the end

### Step 3: Configure Client Computers

**Option A - Quick (For testing with a few users):**
- Give colleagues the **HOSTS_FILE_INSTRUCTIONS.txt**
- They add one line to their hosts file

**Option B - Recommended (For all users):**
- Contact network admin to add DNS A record
- Point `sunidhinew.com` to your server's IP

## 🧪 Testing

**On Server:**
```
http://sunidhinew.com
http://localhost
```

**On Colleague's Computer** (after hosts file config):
```
ping sunidhinew.com
http://sunidhinew.com
```

## 📊 Project Status

✅ Production build completed
✅ IIS configuration files created
✅ Automated setup script ready
✅ Documentation complete
✅ Ready for deployment

## 🏗️ Technical Details

- **Framework:** Next.js 15.5.9
- **Server:** IIS with iisnode
- **Runtime:** Node.js
- **Port:** 80 (HTTP)
- **Domain:** sunidhinew.com (intranet)
- **Pages:** 30+ static pages
- **Features:**
  - Responsive design
  - Dynamic calculators
  - PDF viewer (CSR page)
  - RSS news feed integration
  - Image galleries

## 🔧 Maintenance

### Updating the Website

When code changes are made:

```batch
# 1. Build the application
npm run build

# 2. Restart IIS site
iisreset
```

### Viewing Logs

Check for errors in:
```
C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\iisnode\
```

### Common Commands

```batch
# Restart IIS
iisreset

# Check IIS status
net start w3svc

# View Node processes
tasklist | findstr node.exe

# Flush DNS cache (on client)
ipconfig /flushdns
```

## 🛠️ Troubleshooting

### Site Won't Load

1. Check IIS Manager - is site "Started"?
2. Check Application Pool - is it running?
3. Check Windows Firewall - is port 80 allowed?
4. Check logs in `iisnode` folder

### Can't Access from Other Computers

1. Verify firewall allows port 80
2. Check hosts file on client has correct IP
3. Ping server IP from client
4. Test: `http://<SERVER-IP>` directly

### 500 Internal Server Error

1. Check iisnode logs
2. Verify Node.js is in PATH
3. Check file permissions
4. See IIS_DEPLOYMENT_GUIDE.md for details

## 📁 Project Structure

```
sunidhi-nextjs/
├── .next/                   # Production build (auto-generated)
├── public/
│   └── images/              # Website images
├── src/
│   ├── app/                 # Next.js pages
│   ├── components/          # React components
│   └── lib/                 # Utilities
├── web.config               # IIS configuration
├── server.js                # Node.js server for IIS
├── SETUP_IIS.bat            # Setup script
└── [Documentation files]
```

## 🌐 Accessing the Site

### On Your Network

**From any computer with hosts file configured:**
```
http://sunidhinew.com
```

**Direct IP access (no DNS needed):**
```
http://192.168.x.x
(Replace with your server's actual IP)
```

### Available Pages

- Home: `/`
- Services: `/services/*`
- Markets: `/markets/*`
- Tools: `/tools/*`
- About: `/about/*`
- Support: `/support/*`

## 🔐 Security Notes

- ✅ Running on internal network only
- ✅ HTTP is acceptable for intranet
- ✅ Windows Firewall enabled
- ⚠️ For external access, configure HTTPS with SSL

## 📞 Support

**For Setup Issues:**
- See: **IIS_DEPLOYMENT_GUIDE.md**
- Check: iisnode logs

**For User Access Issues:**
- See: **HOSTS_FILE_INSTRUCTIONS.txt**
- Verify: hosts file configuration

**For Technical Questions:**
- Check: **QUICK_START_GUIDE.txt**
- Review: Windows Event Viewer logs

## ✅ Deployment Checklist

Before going live, verify:

- [ ] IIS URL Rewrite Module installed
- [ ] iisnode installed
- [ ] Node.js working (`node --version`)
- [ ] Production build completed (`npm run build`)
- [ ] SETUP_IIS.bat run as Administrator
- [ ] IIS site "Sunidhi" is Started
- [ ] Application Pool is running
- [ ] Windows Firewall allows port 80
- [ ] Tested on server: http://sunidhinew.com
- [ ] Server IP address documented: ___________
- [ ] Hosts file instructions sent to colleagues
- [ ] OR DNS A record configured
- [ ] At least one colleague can access the site

## 📈 Next Steps

1. **Test Deployment** - Verify site works on server
2. **Configure Clients** - Set up hosts file or DNS
3. **User Testing** - Have colleagues test access
4. **Monitor Logs** - Check for any errors
5. **Go Live** - Announce to team

## 🎉 Success Criteria

You'll know deployment is successful when:

✅ Site loads on server at http://sunidhinew.com
✅ Colleagues can access from their computers
✅ All pages load correctly
✅ Images display properly
✅ No errors in iisnode logs
✅ Site is fast and responsive

## 📝 Notes

- Site uses production build (.next folder)
- Environment variables from .env.local are used
- Logs are in iisnode folder (auto-created)
- Port 80 is standard HTTP (no HTTPS configured)
- Compatible with all modern browsers

---

**Ready to deploy?** Start with **QUICK_START_GUIDE.txt**

**Need help?** See **IIS_DEPLOYMENT_GUIDE.md**

**For colleagues?** Share **HOSTS_FILE_INSTRUCTIONS.txt**

---

*Generated: December 2024*
*Version: 1.0*
*Status: Ready for Production*
