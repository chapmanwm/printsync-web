# PrintSync - 3D Printer Filament Tracker

A modern web app for tracking 3D print filament usage across shared printers.

## Features

- 🎨 **Clean Web UI** - View prints with thumbnails, claim with one click
- 🤖 **Auto-scraping** - Fetches print data from MakerWorld every 6 hours
- ⚡ **Auto-claiming** - Optional post-processing script for Bambu Studio
- 📊 **Print history** - Track who used how much filament
- 🔄 **Real-time sync** - Updates reflect immediately

---

## Architecture

```
MakerWorld API
    ↓ (GitHub Actions every 6 hours)
Vercel API Endpoint
    ↓
Vercel Postgres Database
    ↓
Next.js Web UI
```

**Optional:** Bambu Studio post-processing script → auto-claims prints

---

## Setup Guide

### Part 1: Deploy to Vercel

1. **Fork/Clone this repo**

2. **Create Vercel account** (free tier is enough)
   - Go to https://vercel.com/signup

3. **Connect GitHub repo**
   - New Project → Import Git Repository
   - Select `printsync-web` folder as root
   - Framework: Next.js (auto-detected)

4. **Add Vercel Postgres**
   - In project dashboard → Storage → Create Database
   - Select "Postgres"
   - Connect to project

5. **Set environment variables** in Vercel:
   ```
   API_SECRET=your-random-secret-key-here
   ```
   Generate a random key: `openssl rand -hex 32`

6. **Deploy**
   - Click Deploy
   - Wait ~2 minutes

7. **Initialize database**
   - Visit: `https://your-app.vercel.app/api/init`
   - Add header: `x-api-key: your-secret-key`
   - Or use curl:
     ```bash
     curl -H "x-api-key: YOUR_SECRET" https://your-app.vercel.app/api/init
     ```

### Part 2: Configure GitHub Actions (Scraper)

1. **Get your MakerWorld token**
   - Go to https://makerworld.com
   - Open DevTools (F12) → Application → Cookies
   - Copy the `token` value

2. **Add GitHub Secrets** in your PrintSync repo:
   - Settings → Secrets → Actions
   - Add these secrets:
     ```
     MAKERWORLD_TOKEN = <token from step 1>
     API_URL = https://your-app.vercel.app/api/prints
     API_SECRET = <same secret from Vercel>
     ```

3. **Enable GitHub Actions**
   - Actions tab → Enable workflows
   - The scraper will run every 6 hours automatically
   - Or trigger manually: Actions → MakerWorld → Run workflow

4. **Verify it works**
   - After first run, visit your Vercel app
   - You should see your prints!

### Part 3: Set Up Auto-Claiming (Optional)

For users who want auto-claiming when they slice in Bambu Studio:

1. **Copy the script**
   - Copy `bambu-auto-claim.py` to a permanent location
   - Example: `~/Documents/bambu-auto-claim.py`

2. **Edit configuration**
   ```python
   USER = "Chapman"  # Change to your name
   API_URL = "https://your-app.vercel.app/api/prints"
   ```

3. **Install requests library**
   ```bash
   pip3 install requests
   ```

4. **Add to Bambu Studio**
   - Open Bambu Studio
   - Others tab → Post-processing scripts
   - Click "+" and add the path to your script
   - Example: `/Users/you/Documents/bambu-auto-claim.py`

5. **Test it**
   - Slice any model from MakerWorld
   - Send to printer
   - Print should auto-claim to your name!

---

## Usage

### Web UI

Visit `https://your-app.vercel.app`

**Claiming a print:**
1. Click "Unclaimed" tab
2. See prints with thumbnails and filament usage
3. Click your name to claim

**Viewing history:**
- Click "Claimed" to see all claimed prints
- Click "All" to see everything

**Unclaiming:**
- Click "Unclaim" on any claimed print

### Manual API Usage

**Claim a print:**
```bash
curl -X POST https://your-app.vercel.app/api/prints/PRINT_ID/claim \
  -H "Content-Type: application/json" \
  -d '{"user": "Alfonso"}'
```

**Get unclaimed prints:**
```bash
curl https://your-app.vercel.app/api/prints?claimed=false
```

---

## Cost Analysis

| Service | Free Tier | Expected Usage | Cost |
|---------|-----------|----------------|------|
| **Vercel** | 100GB bandwidth, 6000 build minutes | ~1GB/month | **$0** |
| **Vercel Postgres** | 256MB, 60 hrs compute/month | ~10MB, ~2 hrs/month | **$0** |
| **GitHub Actions** | 2000 minutes/month | 120 minutes/month (4 runs/day × 10 min) | **$0** |

**Total: FREE** (well within free tiers)

Previous cost with 15-min schedule: ~$37/month 😱
New cost with 6-hour schedule: $0 🎉

---

## Troubleshooting

### Prints not showing up
- Check GitHub Actions logs: Are scraper runs succeeding?
- Check Vercel logs: Is API receiving data?
- Verify MakerWorld token is still valid

### Auto-claim not working
- Check script configuration (USER and API_URL)
- Verify `requests` library is installed
- Check Bambu Studio console for errors

### Database errors
- Re-run database init: `/api/init` with API key header
- Check Vercel Postgres connection in dashboard

---

## Development

**Run locally:**
```bash
cd printsync-web
npm install
npm run dev
```

**Environment variables** (`.env.local`):
```
POSTGRES_URL=your-local-postgres-url
API_SECRET=test-secret
```

---

## What's Next?

Future improvements:
- 📱 **Mobile PWA** with push notifications
- 🏠 **Local MQTT listener** to capture SD card/mobile prints
- 📊 **Analytics dashboard** with filament usage graphs
- 🔔 **Notification system** for unclaimed prints
- 📤 **Export to CSV** for accounting

---

## License

MIT - use it however you want!
