# IIS Deployment Guide for Sunidhi Website

## Prerequisites

1. **Install IIS URL Rewrite Module**
   - Download from: https://www.iis.net/downloads/microsoft/url-rewrite
   - Install the module on your IIS server

2. **Install iisnode**
   - Download from: https://github.com/Azure/iisnode/releases
   - Install version for your system (x64 or x86)

3. **Verify Node.js Installation**
   - Open Command Prompt as Administrator
   - Run: `node --version` (should show v18 or higher)
   - Run: `npm --version`

## Deployment Steps

### Step 1: Prepare the Application

The application has already been built. You should have a `.next` folder in your project directory.

### Step 2: Set Up IIS

1. **Open IIS Manager**
   - Press `Win + R`, type `inetmgr`, and press Enter

2. **Create a New Site**
   - Right-click on "Sites" in the left panel
   - Select "Add Website"
   - Fill in the details:
     - **Site name**: Sunidhi
     - **Physical path**: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs`
     - **Binding type**: http
     - **Port**: 80
     - **Host name**: sunidhinew.com

3. **Set Application Pool**
   - Select the newly created site
   - Click "Basic Settings" in the right panel
   - Click "Select" next to Application Pool
   - Choose or create a new Application Pool with:
     - **.NET CLR version**: No Managed Code
     - **Managed pipeline mode**: Integrated

4. **Configure Application Pool Identity**
   - Go to "Application Pools" in the left panel
   - Right-click on your application pool
   - Select "Advanced Settings"
   - Under "Process Model", set "Identity" to "NetworkService" or a service account with appropriate permissions

5. **Set Folder Permissions**
   - Right-click on `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs`
   - Select "Properties" > "Security"
   - Add "IIS_IUSRS" and "IUSR" with Read & Execute permissions
   - Add your Application Pool Identity (e.g., "IIS APPPOOL\Sunidhi") with Modify permissions

### Step 3: Configure DNS/Hosts File

**Option A: Configure on Each Client Computer (Quick Setup)**

On each colleague's computer:

1. Open Notepad as Administrator
2. Open file: `C:\Windows\System32\drivers\etc\hosts`
3. Add this line at the end:
   ```
   <YOUR-SERVER-IP>   sunidhinew.com
   ```
   Replace `<YOUR-SERVER-IP>` with your server's IP address
   Example: `192.168.1.100   sunidhinew.com`
4. Save and close

**Option B: Configure on DNS Server (Recommended for Network)**

If you have a DNS server in your network:

1. Open DNS Manager on your DNS server
2. Create a new A record:
   - **Name**: sunidhinew
   - **IP Address**: Your IIS server's IP
3. Save the record

### Step 4: Find Your Server IP Address

Run this command in Command Prompt on the IIS server:
```
ipconfig
```
Look for "IPv4 Address" under your network adapter.

### Step 5: Test the Deployment

1. **On the Server**:
   - Open a browser
   - Go to: http://localhost
   - Go to: http://sunidhinew.com

2. **On Colleague's Computer** (after hosts file update):
   - Open a browser
   - Go to: http://sunidhinew.com

### Step 6: Start the Site

1. In IIS Manager, select your site
2. Click "Start" in the Actions panel on the right
3. The site should now be running

## Troubleshooting

### Site Not Loading

1. **Check if IIS site is running**:
   - Open IIS Manager
   - Verify the site status is "Started"

2. **Check Windows Firewall**:
   - Open Windows Firewall with Advanced Security
   - Create an Inbound Rule for Port 80 (HTTP)

3. **Verify iisnode logs**:
   - Check logs in: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\iisnode`

### 500 Internal Server Error

1. Enable detailed errors:
   - In web.config, change `devErrorsEnabled="false"` to `devErrorsEnabled="true"`
   - Restart the site in IIS

2. Check Application Pool is running:
   - Go to Application Pools in IIS
   - Make sure your pool is started

### Cannot Access from Other Computers

1. **Verify firewall settings**:
   ```
   netsh advfirewall firewall add rule name="IIS HTTP" dir=in action=allow protocol=TCP localport=80
   ```

2. **Check hosts file on client computer**:
   - Make sure the IP address is correct
   - Try accessing via IP first: `http://<SERVER-IP>`

3. **Test connectivity**:
   - From client computer, run: `ping <SERVER-IP>`
   - If ping fails, there's a network connectivity issue

## Quick Commands for Troubleshooting

```batch
# Restart IIS
iisreset

# Check if port 80 is listening
netstat -ano | findstr :80

# Test from command line
curl http://sunidhinew.com

# Check Node.js process
tasklist | findstr node.exe
```

## Environment Variables

If you need to set environment variables (like N8N_WEBHOOK_URL):

1. Open IIS Manager
2. Select your site
3. Double-click "Configuration Editor"
4. In the "Section" dropdown, select: `system.webServer/iisnode`
5. Click on "node_env" and add your environment variables

Or add them to web.config in the iisnode section.

## Updating the Site

When you make changes to the code:

1. Stop the site in IIS Manager
2. Run: `npm run build`
3. Start the site in IIS Manager
4. IIS will automatically restart the Node.js process

## Support

If you encounter issues:
1. Check iisnode logs in the `iisnode` folder
2. Check Windows Event Viewer > Application logs
3. Enable detailed errors in web.config temporarily

## Production Checklist

- [ ] IIS URL Rewrite Module installed
- [ ] iisnode installed
- [ ] Node.js is accessible from command line
- [ ] Web.config file is in the project root
- [ ] server.js file is in the project root
- [ ] Application built with `npm run build`
- [ ] IIS site created and configured
- [ ] Application Pool set to "No Managed Code"
- [ ] Folder permissions set correctly
- [ ] Hosts file updated on all client computers OR DNS record created
- [ ] Windows Firewall configured to allow port 80
- [ ] Site is started in IIS
- [ ] Tested from server: http://sunidhinew.com
- [ ] Tested from client computer: http://sunidhinew.com
