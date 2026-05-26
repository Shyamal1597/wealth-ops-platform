# 📸 Visual Step-by-Step Guide

## 🎯 What You Need to Do (3 Simple Steps!)

---

## Step 1: Open n8n in Your Browser

1. Open your web browser (Chrome, Firefox, etc.)
2. Type in the address bar: `http://localhost:5678`
3. Press Enter

You should see the n8n dashboard.

---

## Step 2: Import the Workflow I Created

### 2a. Find the Import Button

Look at the **top-right corner** of n8n:
- You'll see a **"+"** button or **"Add Workflow"**
- Click on it

### 2b. Select "Import from File"

A menu will appear with options:
- Click **"Import from File"** or **"Import from URL"**

### 2c. Choose the File

A file browser will open:
1. Navigate to: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\`
2. Look for the file: **`n8n-rss-workflow-with-webhook.json`**
3. Click on it
4. Click **"Open"** or **"Import"**

### 2d. Workflow Imported!

You'll now see a workflow canvas with several nodes connected:
```
[RSS Economic Times] ──┐
                        │
[RSS MoneyControl]  ────┼──> [Merge] → [Format Data] → [Webhook]
                        │
[RSS Business Std]  ────┘
```

---

## Step 3: Activate the Workflow

### 3a. Find the Toggle Switch

At the **top-right** of the workflow canvas:
- You'll see a **toggle switch** (looks like: ⚪ or 🟢)
- Next to it says: "Inactive" or "Active"

### 3b. Click the Toggle

- Click the toggle switch
- It should turn **GREEN** 🟢
- Text should change to **"Active"**

**✅ Your workflow is now running!**

---

## Step 4: Get the Webhook URL

### 4a. Click on the Webhook Node

In your workflow canvas:
- Look for the **last node** on the right
- It's labeled **"Webhook"**
- **Click on it**

### 4b. Find the Production URL

A panel opens on the right side showing:

```
┌─────────────────────────────────────┐
│       Webhook Settings              │
├─────────────────────────────────────┤
│ HTTP Method: GET                    │
│ Path: sunidhi-news                  │
│                                     │
│ Production URL:                     │
│ http://localhost:5678/              │
│ webhook/sunidhi-news                │
│                                     │
│ [Copy URL] 📋                       │
└─────────────────────────────────────┘
```

### 4c. Copy the URL

- You'll see: `http://localhost:5678/webhook/sunidhi-news`
- Click the **"Copy"** button or manually select and copy it

---

## Step 5: Verify Everything is Set Up

### 5a. Test the Webhook in Browser

1. Open a **new browser tab**
2. Paste the webhook URL: `http://localhost:5678/webhook/sunidhi-news`
3. Press Enter

**What you should see:**
```json
{
  "articles": [
    {
      "title": "Sensex closes 200 points higher",
      "description": "Markets ended on a positive note...",
      "link": "https://economictimes.com/...",
      "pubDate": "2025-12-16T10:30:00Z",
      "source": "Economic Times"
    },
    ...more articles...
  ]
}
```

**✅ If you see JSON data like above = SUCCESS!**

---

## Step 6: Restart Your Website

Since I've already updated the `.env.local` file with the correct URL, you just need to restart:

### In VS Code or Terminal:

1. **Stop the current dev server:**
   - Press `Ctrl + C` in the terminal

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Wait for it to start:**
   ```
   ✓ Ready in 2s
   - Local: http://localhost:3001
   ```

---

## Step 7: See Your Live News Feed!

### 7a. Open Your Website

In your browser, go to:
```
http://localhost:3001/markets/updates
```

### 7b. What You Should See

**Loading State (first 2 seconds):**
- A spinning loader
- Text: "Loading latest updates..."

**Success State:**
- 📰 Newspaper icon
- Header: "Latest News"
- Article count: "20 articles • Updates every 5 minutes"
- **Refresh** button
- List of news cards showing:
  - Article titles
  - Descriptions
  - Source
  - Time (e.g., "2 hours ago")
  - "Read Full Article" link

**✅ SUCCESS! Your RSS feed is live!**

---

## 🎉 You're Done!

Your website is now showing live news from:
- Economic Times
- MoneyControl
- Business Standard

The news updates automatically every 5 minutes!

---

## 🔍 Troubleshooting Visual Guide

### Problem: Workflow Won't Import

**Look for:**
- Error message in n8n
- Check file location is correct
- Make sure the file isn't corrupted

**Solution:**
- Try downloading the workflow again
- Check the file is named exactly: `n8n-rss-workflow-with-webhook.json`

---

### Problem: Toggle Won't Turn Green

**Look for:**
- Red error icon on any node
- Error message at the top

**Solution:**
- Click on each node to check for errors
- Make sure all RSS feed URLs are accessible
- Try clicking "Execute Workflow" button first

---

### Problem: Webhook Shows "Unauthorized"

**Look for:**
- 401 or 403 error in browser

**Solution:**
- Make sure workflow is ACTIVE (green toggle)
- Check webhook node settings
- Verify path is `sunidhi-news`

---

### Problem: No Articles on Website

**Check:**
1. **Is n8n workflow active?** (green toggle)
2. **Does webhook URL work in browser?** (test it)
3. **Is `.env.local` correct?** (should be `http://localhost:5678/webhook/sunidhi-news`)
4. **Did you restart dev server?** (Ctrl+C, then `npm run dev`)

**Debug:**
- Open browser console (F12)
- Click "Network" tab
- Refresh the page
- Look for `/api/news` request
- Check if it's returning data

---

## 📱 What Each Part Does

### In n8n:
```
[RSS Readers] → Fetch news from websites
       ↓
    [Merge] → Combine all news into one list
       ↓
[Format Data] → Convert to format website needs
       ↓
   [Webhook] → Expose data as URL endpoint
```

### On Your Website:
```
[Daily Updates Page]
       ↓
  [Calls /api/news]
       ↓
[API fetches from n8n webhook]
       ↓
[Displays articles on page]
```

---

## 🎯 Quick Reference

| Item | Value |
|------|-------|
| n8n URL | `http://localhost:5678` |
| Webhook URL | `http://localhost:5678/webhook/sunidhi-news` |
| Website URL | `http://localhost:3001/markets/updates` |
| Config File | `.env.local` |
| Workflow File | `n8n-rss-workflow-with-webhook.json` |

---

**Need Help?** Just ask - I'm here to help! 😊
