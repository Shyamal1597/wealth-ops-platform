# 🚀 Quick n8n Setup - 5 Minutes!

## Option 1: Import the Ready-Made Workflow (EASIEST!)

I've created a complete workflow for you with the webhook already configured!

### Step 1: Open n8n
1. Open your browser
2. Go to: `http://localhost:5678`
3. Login if needed

### Step 2: Import the Workflow
1. Click the **"+"** button (top right) or go to **Workflows**
2. Click **"Import from File"**
3. Select the file: `n8n-rss-workflow-with-webhook.json` (in your project folder)
4. Click **Open/Import**

### Step 3: Activate the Workflow
1. You'll see the imported workflow with all nodes connected
2. Click the **toggle switch** at the top-right (it should turn green)
3. The workflow is now ACTIVE! ✅

### Step 4: Get Your Webhook URL
1. Click on the **"Webhook"** node (the last node in the workflow)
2. Look for **"Production URL"** - it will show:
   ```
   http://localhost:5678/webhook/sunidhi-news
   ```
3. **Copy this entire URL**

### Step 5: Add URL to Your Project
1. Open the file: `.env.local` (in your sunidhi-nextjs folder)
2. Replace `YOUR_WEBHOOK_URL_HERE` with:
   ```
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/sunidhi-news
   ```
3. Save the file

### Step 6: Restart Your Dev Server
```bash
# In your terminal, press Ctrl+C to stop the server
# Then run:
npm run dev
```

### Step 7: Test It!
1. Visit: `http://localhost:3001/markets/updates`
2. You should see live news articles! 🎉

---

## Option 2: Add Webhook to Your Existing Workflow

If you want to keep your existing "Working RSS newsfeed v1" workflow:

### Step 1: Open Your Workflow
1. Go to `http://localhost:5678`
2. Click on **"Working RSS newsfeed v1"**

### Step 2: Add Webhook Node
1. Click the **"+"** button at the end of your workflow
2. Search for **"Webhook"**
3. Click on **"Webhook"** to add it

### Step 3: Configure Webhook
In the Webhook node settings:
- **HTTP Method**: `GET`
- **Path**: `sunidhi-news`
- **Respond**: `When Last Node Finishes`

### Step 4: Add Formatting Node (IMPORTANT!)

Before the webhook, add a **"Code"** node to format your data:

1. Click **"+"** before the Webhook
2. Search for **"Code"**
3. Add this JavaScript code:

```javascript
// Format RSS data for the Sunidhi website
const items = $input.all();

// Sort by date (newest first)
const sortedItems = items.sort((a, b) => {
  const dateA = new Date(a.json.pubDate || a.json.isoDate || 0);
  const dateB = new Date(b.json.pubDate || b.json.isoDate || 0);
  return dateB - dateA;
});

// Take only the latest 20 articles
const latestArticles = sortedItems.slice(0, 20);

// Format articles
const articles = latestArticles.map(item => {
  const json = item.json;

  return {
    title: json.title || 'Untitled',
    description: json.description || json.contentSnippet || '',
    link: json.link || json.url || '',
    pubDate: json.pubDate || json.isoDate || new Date().toISOString(),
    source: json.creator || 'Unknown',
    author: json.author || ''
  };
});

// Return in the expected format
return [{ json: { articles } }];
```

### Step 5: Connect Everything
```
[Your RSS Nodes] → [Code Node] → [Webhook Node]
```

### Step 6: Activate & Get URL
1. Toggle the workflow to **ACTIVE** (green)
2. Click the Webhook node
3. Copy the **Production URL**
4. Add it to `.env.local` as shown above

---

## 🎯 Testing Your Webhook

### Quick Test in Browser:
1. Copy your webhook URL
2. Paste it in browser: `http://localhost:5678/webhook/sunidhi-news`
3. You should see JSON data with articles!

### Expected Response:
```json
{
  "articles": [
    {
      "title": "Market Update: Sensex Rises 200 Points",
      "description": "Indian stock markets closed higher today...",
      "link": "https://example.com/article",
      "pubDate": "2025-12-16T10:30:00Z",
      "source": "Economic Times",
      "author": "John Doe"
    }
  ]
}
```

---

## ✅ Checklist

After setup, verify:
- [ ] Workflow is ACTIVE (green toggle)
- [ ] Webhook URL copied
- [ ] `.env.local` file updated
- [ ] Dev server restarted
- [ ] Webhook URL works in browser (shows JSON)
- [ ] Daily Updates page shows articles

---

## 🆘 Need Help?

**Webhook not working?**
- Make sure workflow is ACTIVE (toggle must be green!)
- Try executing the workflow manually (click "Execute Workflow")
- Check n8n execution history for errors

**No articles showing?**
- Test webhook URL in browser first
- Check browser console (F12) for errors
- Make sure `.env.local` has correct URL
- Restart dev server after changing `.env.local`

---

## 📍 Your Files

1. **Workflow JSON**: `n8n-rss-workflow-with-webhook.json` (import this!)
2. **Environment**: `.env.local` (add webhook URL here)
3. **Full Guide**: `RSS_FEED_SETUP_GUIDE.md` (detailed docs)

---

**Time to complete**: 5 minutes ⏱️
**Difficulty**: Easy 🟢
