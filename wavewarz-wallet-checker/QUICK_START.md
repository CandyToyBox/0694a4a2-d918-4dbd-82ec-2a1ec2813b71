# Quick Start Guide - 2 Minutes to Deploy

## For the Impatient

### Step 1: Build & Test Locally (1 minute)
```bash
cd wavewarz-wallet-checker
npm install
npm run dev
```
Open http://localhost:5173 in your browser. Try scanning a wallet!

### Step 2: Deploy to Vercel (1 minute)

Choose ONE:

**Option A - CLI (Easiest):**
```bash
npm install -g vercel
vercel
```

**Option B - Web Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import this repository
3. Click Deploy

### Step 3: Set Environment Variable
1. In Vercel dashboard, go to project settings → Environment Variables
2. Add: `VITE_HELIUS_API_KEY` = `311ab6c5-2a28-43d6-b0e4-2782fee7b915`
3. Re-deploy (Vercel will rebuild automatically)

## ✅ Done!

You now have a live wallet claim checker at your Vercel URL.

## What You Get

- A standalone website (separate from your main dashboard)
- Users can scan their Solana wallet to find claimable battle shares
- Direct links to wavewarz.com to complete transactions
- Deployed on Vercel's global CDN (fast worldwide)
- Custom domain support (optional)

## Test It

1. Copy your Vercel URL
2. Go to it in your browser
3. Paste a Solana wallet address: `6BKXG3yCn6ewsvjUSvWN3v8K1pZmSGc9d7VYXvppcF3n` (example)
4. Click "Scan Wallet"
5. See the results!

## File Locations

- **Source code:** `wavewarz-wallet-checker/src/`
- **Configuration:** `wavewarz-wallet-checker/vercel.json` (already set up)
- **Documentation:** See README.md, DEPLOYMENT.md, PROJECT_SUMMARY.md

## Customize (Optional)

**Change the title:**
- Edit `index.html` → change `<title>`
- Edit `src/App.tsx` → change the header text

**Change colors:**
- Edit `tailwind.config.js` or update class names in components

**Change the RPC endpoint:**
- Edit `.env` → change `VITE_HELIUS_API_KEY`

**Add a custom domain:**
- In Vercel dashboard → Domains → Add your domain

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm install` again, then `npm run build` |
| Blank page on deploy | Check environment variables in Vercel |
| Wallet scans are slow | Normal - depends on number of battles. First load slower than subsequent. |
| Links don't work | Check that wavewarz.com URLs are correct in `src/components/WalletChecker.tsx` |

## Next Steps

- Add to your website's navigation
- Share the Vercel URL with users
- Monitor performance in Vercel dashboard
- Update when you add new features

---

That's it! Questions? Check README.md or DEPLOYMENT.md for more details.
