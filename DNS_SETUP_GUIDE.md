# DNS Setup Guide for sunidhinew.com

Your website is working at: `http://192.168.48.102`

To allow everyone to use `http://sunidhinew.com` instead, you have **3 options**:

---

## Option 1: Router DNS (EASIEST - Recommended)

If you have access to your office router/gateway:

1. **Login to your router**
   - Usually at: `http://192.168.1.1` or `http://192.168.0.1`
   - Check the router label for the admin URL and password

2. **Find DNS or Local DNS settings**
   - Look for sections like:
     - "DNS Settings"
     - "Local DNS"
     - "Static DNS"
     - "Custom DNS Records"
     - "Local Domain Names"

3. **Add DNS entry:**
   - Hostname: `sunidhinew.com`
   - IP Address: `192.168.48.102`
   - Save settings

4. **Done!** Everyone on the network can now use `http://sunidhinew.com`

**No changes needed on any computer!**

---

## Option 2: Windows DNS Server (Best for Corporate)

If your office has a Windows Server with DNS:

1. **Contact your IT administrator**

2. **Ask them to add an A Record:**
   - Zone: Your domain or create new zone
   - Name: `sunidhinew.com`
   - Type: A (IPv4)
   - IP: `192.168.48.102`

3. **Done!** Everyone automatically gets the DNS entry

---

## Option 3: Local DNS Server on Your Computer

Turn your computer into a DNS server (requires colleagues to change DNS settings):

### Setup on YOUR computer:

Run the script: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\setup-local-dns.ps1`

### Setup on COLLEAGUE computers:

Each colleague needs to change their DNS:

1. Open **Control Panel** → **Network and Sharing Center**
2. Click your network connection
3. Click **Properties**
4. Select **Internet Protocol Version 4 (TCP/IPv4)**
5. Click **Properties**
6. Select **"Use the following DNS server addresses"**
7. Preferred DNS: `192.168.48.102`
8. Alternate DNS: `8.8.8.8`
9. Click **OK**

Then they can access: `http://sunidhinew.com`

---

## Option 4: Keep Using IP Address (No Setup)

Everyone just uses: `http://192.168.48.102`

**Pros:** No setup required, works immediately
**Cons:** Less professional, harder to remember

---

## Recommendation

1. **Try Option 1 first** (Router DNS) - easiest and best
2. If no router access, **try Option 2** (contact IT admin)
3. If no IT support, **use Option 4** (just use IP address)
4. Option 3 is complex and requires changes on every computer

---

## Current Status

✅ Website is running at: http://192.168.48.102
✅ IIS configured and working
✅ Firewall configured
✅ No hosts file needed

Just need DNS to enable the friendly name!
