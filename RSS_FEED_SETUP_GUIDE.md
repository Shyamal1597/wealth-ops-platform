# RSS Newsfeed Integration Setup Guide

## Overview
This guide explains how to connect your n8n "Working RSS newsfeed v1" workflow to the Daily Updates page on your Sunidhi website.

---

## 🎯 What We've Built

### 1. API Route (`/api/news`)
- **Location**: `src/app/api/news/route.ts`
- **Purpose**: Fetches news from your n8n webhook and serves it to the frontend
- **Features**:
  - 5-minute caching for better performance
  - Error handling with fallback messages
  - Supports both GET (cached) and POST (fresh) requests

### 2. Daily Updates Page
- **Location**: `src/app/markets/updates/page.tsx`
- **Features**:
  - Auto-refresh every 5 minutes
  - Manual refresh button
  - Loading states and error handling
  - Beautiful card-based layout
  - Relative timestamps ("2 hours ago")
  - External link to full articles

---

## 📋 Setup Instructions

### Step 1: Configure Your n8n Workflow

#### Option A: Add a Webhook Response Node (Recommended)

1. Open your **"Working RSS newsfeed v1"** workflow in n8n
2. At the end of your workflow, add a **Webhook** node:
   - **Webhook Name**: sunidhi-rss-feed (or any name you prefer)
   - **HTTP Method**: GET
   - **Response Mode**: On last node
   - **Response Data**: Using 'Respond to Webhook' Node

3. Add a **Code** node (or **Function** node) before the webhook to format your data:

```javascript
// Format RSS data for the website
const items = $input.all();

const articles = items.map(item => ({
  title: item.json.title || 'Untitled',
  description: item.json.description || item.json.summary || '',
  link: item.json.link || item.json.url || '',
  pubDate: item.json.pubDate || item.json.published || new Date().toISOString(),
  source: item.json.source || item.json.creator || 'Unknown',
  author: item.json.author || ''
}));

// Return in the expected format
return [{ json: { articles } }];
```

4. Connect this node to your Webhook node
5. **Activate your workflow** (toggle the switch at the top)
6. **Copy the Webhook URL** - it will look like:
   - `https://yourname.app.n8n.cloud/webhook/sunidhi-rss-feed`
   - OR `http://localhost:5678/webhook/sunidhi-rss-feed` (if running locally)

#### Option B: Use HTTP Request Node Endpoint

If your n8n workflow already has an endpoint, you can use that directly.

---

### Step 2: Configure Environment Variables

1. In your project root folder, create a file named `.env.local`:

```bash
# Create the file
cd C:\Users\SSFL-RETAIL-017\sunidhi-nextjs
```

2. Add your n8n webhook URL to `.env.local`:

```env
N8N_WEBHOOK_URL=https://yourname.app.n8n.cloud/webhook/sunidhi-rss-feed
```

**⚠️ Important Notes:**
- Replace the URL with your actual n8n webhook URL
- The `.env.local` file is git-ignored and won't be committed
- Never share your webhook URL publicly

---

### Step 3: Restart the Development Server

After creating/updating `.env.local`:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

The server will now load the environment variables.

---

### Step 4: Test the Integration

1. **Visit the Daily Updates page**:
   - Navigate to: `http://localhost:3001/markets/updates`

2. **What you should see**:
   - Loading spinner initially
   - If configured correctly: Your RSS feed articles
   - If not configured: Error message with "Try Again" button

3. **Test the Refresh button**:
   - Click "Refresh" to manually fetch latest news

---

## 🔍 Troubleshooting

### Problem: "Unable to Load News" Error

**Possible causes:**

1. **n8n webhook URL not configured**
   - ✅ Check `.env.local` exists and contains `N8N_WEBHOOK_URL`
   - ✅ Restart dev server after creating `.env.local`

2. **n8n workflow not active**
   - ✅ Open your workflow in n8n
   - ✅ Make sure the toggle switch is ON (active)

3. **Webhook URL incorrect**
   - ✅ Copy the webhook URL from n8n again
   - ✅ Make sure there are no extra spaces
   - ✅ Test the URL in Postman or browser first

4. **CORS issues** (if n8n is on a different domain)
   - ✅ In n8n, enable CORS in your webhook settings
   - ✅ Or use the API route as a proxy (already configured)

### Problem: Data Not Displaying Correctly

**Check your n8n response format:**

Your n8n workflow should return JSON in one of these formats:

**Format 1** (Recommended):
```json
{
  "articles": [
    {
      "title": "Market Update",
      "description": "Summary of the article",
      "link": "https://example.com/article",
      "pubDate": "2025-12-16T10:30:00Z",
      "source": "Economic Times"
    }
  ]
}
```

**Format 2** (Also supported):
```json
[
  {
    "title": "Market Update",
    "description": "Summary of the article",
    "link": "https://example.com/article",
    "pubDate": "2025-12-16T10:30:00Z",
    "source": "Economic Times"
  }
]
```

### Problem: Articles Not Updating

**Solutions:**
1. Click the manual "Refresh" button
2. Wait 5 minutes for auto-refresh
3. Check if your n8n workflow is running on schedule
4. Clear browser cache (Ctrl+Shift+R)

---

## 🧪 Testing Your n8n Webhook

### Test in Browser/Postman:

1. Copy your webhook URL
2. Open in browser or Postman
3. Should return JSON with your articles

Example test with curl:
```bash
curl https://yourname.app.n8n.cloud/webhook/sunidhi-rss-feed
```

Expected response:
```json
{
  "articles": [
    {
      "title": "Test Article",
      "description": "This is a test",
      "pubDate": "2025-12-16T10:00:00Z",
      "link": "https://example.com",
      "source": "Test Source"
    }
  ]
}
```

---

## 🎨 Customization Options

### Change Refresh Interval

In `src/app/markets/updates/page.tsx`, line 27:

```typescript
// Change 300000 (5 minutes) to your preferred interval
const interval = setInterval(fetchNews, 300000);

// Examples:
// 1 minute: 60000
// 10 minutes: 600000
// 15 minutes: 900000
```

### Modify Article Display

Edit the Card component (lines 160-200) to:
- Change layout
- Add/remove fields
- Modify styling
- Add images

### Add Filtering/Search

You can add filter buttons or search functionality to filter news by:
- Source
- Date range
- Keywords

---

## 📊 Expected Data Flow

```
┌─────────────────┐
│   RSS Sources   │
│  (News Feeds)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  n8n Workflow   │
│  "Working RSS   │
│   newsfeed v1"  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  n8n Webhook    │
│  (GET endpoint) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Next.js API   │
│   /api/news     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Daily Updates  │
│      Page       │
└─────────────────┘
```

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** to git (already in .gitignore)
2. **Use HTTPS** for production webhook URLs
3. **Consider adding authentication** to your n8n webhook
4. **Rate limit** your API if needed
5. **Validate data** from n8n before displaying

---

## 🚀 Production Deployment

When deploying to production (Vercel, etc.):

1. Add `N8N_WEBHOOK_URL` to environment variables in your hosting platform
2. Make sure n8n is accessible from the internet
3. Use HTTPS for all connections
4. Test the webhook URL before deploying

### Example: Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - **Key**: `N8N_WEBHOOK_URL`
   - **Value**: Your n8n webhook URL
   - **Environment**: Production
4. Redeploy your application

---

## 📞 Need Help?

If you encounter issues:

1. **Check the browser console** for error messages (F12)
2. **Check the n8n workflow execution history** for errors
3. **Verify the webhook URL** by testing it directly
4. **Check the API route logs** in the terminal

---

## ✅ Quick Checklist

- [ ] n8n workflow is active
- [ ] Webhook node is configured and copied
- [ ] `.env.local` file created with correct URL
- [ ] Development server restarted
- [ ] Page loads without errors
- [ ] Articles are displaying
- [ ] Refresh button works
- [ ] Auto-refresh happens every 5 minutes

---

**Last Updated**: December 16, 2025
**Status**: Ready for configuration
