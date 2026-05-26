# Simple Deployment (Without IIS)

## 🚀 Easiest Way to Deploy

If IIS setup is too complex, you can run the website directly using Node.js. This is simpler and works immediately!

## ✅ Advantages

- ✓ No IIS configuration needed
- ✓ No iisnode installation required
- ✓ Works immediately
- ✓ Perfect for testing or small teams
- ✓ Easy to start and stop

## ⚠️ Disadvantages

- Must keep Command Prompt window open
- Not as robust as IIS for production
- Manual startup after server reboot

## 📋 Simple 3-Step Setup

### Step 1: Start the Server

**Option A - Double-click:**
1. Find file: `START_WITHOUT_IIS.bat`
2. Double-click it
3. Press any key when prompted

**Option B - Command line:**
```batch
cd C:\Users\SSFL-RETAIL-017\sunidhi-nextjs
npm run start
```

The server will start on port 3000.

### Step 2: Find Your Server IP

The batch file will show your IP, or run this:
```batch
ipconfig
```
Look for "IPv4 Address" (e.g., 172.29.240.1)

### Step 3: Configure Windows Firewall

**Quick method:**
1. Open Command Prompt as Administrator
2. Run:
```batch
netsh advfirewall firewall add rule name="Sunidhi Website" dir=in action=allow protocol=TCP localport=3000
```

**GUI method:**
1. Press `Win + R`
2. Type: `wf.msc`
3. Click "Inbound Rules"
4. Click "New Rule..."
5. Choose "Port" → Next
6. TCP, port 3000 → Next
7. Allow the connection → Next
8. Check all → Next
9. Name: "Sunidhi Website" → Finish

## 🌐 Accessing the Website

### On the Server
```
http://localhost:3000
```

### From Colleagues' Computers

If your server IP is `172.29.240.1`:
```
http://172.29.240.1:3000
```

**With Custom Domain (sunidhinew.com):**

On each colleague's computer:
1. Edit hosts file as Administrator
2. Add line:
   ```
   172.29.240.1   sunidhinew.com
   ```
3. Access:
   ```
   http://sunidhinew.com:3000
   ```

## 🔄 Starting the Server

### Manual Start

Every time you want to run the site:
1. Double-click `START_WITHOUT_IIS.bat`
2. Keep the window open

### Auto-start on Boot (Optional)

To make it start automatically when Windows starts:

1. Press `Win + R`
2. Type: `shell:startup`
3. Press Enter
4. Create a shortcut to `START_WITHOUT_IIS.bat` in this folder

Now it will start automatically on boot!

## 🛑 Stopping the Server

1. Go to the Command Prompt window
2. Press `Ctrl + C`
3. Type `Y` when asked
4. Or just close the window

## 🔧 Troubleshooting

### Port 3000 Already in Use

If you see "port 3000 is already in use":

**Option 1 - Stop the other service:**
```batch
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number shown)
taskkill /F /PID <PID>
```

**Option 2 - Use a different port:**

Edit `package.json`, find the `start` script and change it to:
```json
"start": "next start -p 3001"
```

Now the site will run on port 3001 instead.

### Can't Access from Other Computers

1. **Check Windows Firewall:**
   ```batch
   netsh advfirewall show currentprofile
   ```
   Make sure firewall rule is added (Step 3 above)

2. **Test connection:**
   From colleague's computer:
   ```batch
   ping 172.29.240.1
   ```
   Should get replies

3. **Check if server is running:**
   On server:
   ```batch
   netstat -ano | findstr :3000
   ```
   Should show LISTENING

4. **Try direct IP first:**
   Before using domain name, test with IP:
   ```
   http://172.29.240.1:3000
   ```

### Site is Slow or Crashes

The production build is already optimized. If you have issues:

1. Check available memory
2. Close other applications
3. Restart the server

## 📊 Comparison: Simple vs IIS

| Feature | Simple (Node.js) | IIS Deployment |
|---------|------------------|----------------|
| Setup Time | 5 minutes | 30+ minutes |
| Requirements | Node.js only | IIS + iisnode + URL Rewrite |
| Auto-restart | No | Yes |
| Port | 3000 | 80 (standard HTTP) |
| URL | http://ip:3000 | http://sunidhinew.com |
| Runs in background | No | Yes |
| Production ready | Good for small teams | Best for enterprise |

## 💡 Recommendations

**Use Simple Deployment if:**
- ✓ Small team (under 20 people)
- ✓ Testing/development environment
- ✓ Quick deployment needed
- ✓ You don't have IIS expertise

**Use IIS Deployment if:**
- ✓ Large organization
- ✓ Production environment
- ✓ Need automatic restart
- ✓ Want standard HTTP port (80)
- ✓ Have IT support for IIS

## 🎯 Quick Reference

**Start server:**
```batch
START_WITHOUT_IIS.bat
```

**Stop server:**
```
Ctrl + C in the Command Prompt window
```

**Access locally:**
```
http://localhost:3000
```

**Access from network:**
```
http://YOUR-SERVER-IP:3000
```

**Firewall command:**
```batch
netsh advfirewall firewall add rule name="Sunidhi Website" dir=in action=allow protocol=TCP localport=3000
```

## 🔒 Security Notes

For internal network use:
- ✓ Firewall rule limits to port 3000
- ✓ Only accessible from local network
- ✓ No internet exposure

For production/external access:
- Consider setting up HTTPS
- Use proper authentication
- Consult IT security team

## ✨ Summary

This simple deployment method:
1. ✅ Takes 5 minutes to set up
2. ✅ No IIS configuration needed
3. ✅ Works immediately
4. ✅ Perfect for internal use

Just run `START_WITHOUT_IIS.bat` and you're live! 🚀

---

**Need the IIS deployment instead?**
See: `MANUAL_IIS_SETUP.md` after installing iisnode

**Questions?**
See: `QUICK_START_GUIDE.txt` for more help
