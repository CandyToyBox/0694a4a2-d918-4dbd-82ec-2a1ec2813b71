# Deployment Guide - WaveWarz Wallet Claim Checker

This guide covers deploying the wallet claim checker as a standalone site to Vercel.

## Quick Start (Recommended)

### 1. Prepare for Deployment

```bash
# From the project root
cd wavewarz-wallet-checker

# Verify the build works locally
npm install
npm run build
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Deploy from the project directory
vercel
```

Follow the prompts:
- Select "Create a new project"
- Link to your GitHub account (optional, for auto-deploys)
- Set the project name: `wavewarz-wallet-checker`
- Vercel will auto-detect Vite configuration

#### Option B: Using Vercel Web Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository containing this project
4. Vercel will auto-detect the Vite framework
5. Click "Deploy"

### 3. Set Environment Variables

**In Vercel Dashboard:**

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following:
   - **Key:** `VITE_HELIUS_API_KEY`
   - **Value:** `311ab6c5-2a28-43d6-b0e4-2782fee7b915` (or your own Helius API key)
   - **Environments:** Select "Production", "Preview", and "Development"

4. Re-deploy for changes to take effect

## Project Structure for Deployment

```
wavewarz-wallet-checker/
├── src/                          # Source code
│   ├── components/               # React components
│   ├── services/                 # Blockchain services
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
├── dist/                         # Build output (created by npm run build)
├── package.json                  # Dependencies
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind CSS config
├── vercel.json                  # Vercel deployment config
├── index.html                   # HTML entry point
└── .env                         # Local environment variables
```

## Building Manually

To test the build locally before deployment:

```bash
npm install
npm run build
npm run preview
```

The preview server will show you exactly how the production build will look.

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_HELIUS_API_KEY` | Yes | Helius RPC API key for Solana mainnet | `311ab6c5-2a28-43d6-b0e4-2782fee7b915` |

## Custom Domain Setup

1. In Vercel project settings, go to "Domains"
2. Click "Add Domain"
3. Enter your custom domain (e.g., `checker.wavewarz.com`)
4. Update DNS records as instructed by Vercel
5. Wait for DNS propagation (can take a few minutes)

## Performance Optimizations

The deployment includes:
- **Minified production build** - Reduced file sizes
- **CSS optimization** - Tailwind CSS tree-shaking
- **Edge caching** - Vercel CDN for global distribution
- **Automatic HTTPS** - Secure connection

Expected lighthouse scores:
- Performance: 85-95
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## Troubleshooting

### Build fails with "Cannot find module"

**Solution:** Ensure all files are in the correct directory structure. Check that `src/services/blockchain/` contains `helius.ts`, `parser.ts`, and `pda.ts`.

### "VITE_HELIUS_API_KEY is undefined"

**Solution:**
1. Check environment variables are set in Vercel dashboard
2. Ensure the variable name exactly matches `VITE_HELIUS_API_KEY`
3. Re-deploy after setting variables

### RPC calls are slow

**Solution:**
- The app uses Helius RPC with built-in rate limiting (300ms between requests)
- Wallet scans depend on number of battles in the program
- First load fetches all battles from chain (~30-60 seconds on initial run)

### Deploy succeeds but site shows blank page

**Solution:**
1. Check browser console (F12) for errors
2. Verify environment variables are set
3. Check Vercel deployment logs for build errors

## Monitoring and Analytics

Monitor your deployment using Vercel's built-in tools:
- **Deployments** tab - Deployment history and status
- **Analytics** tab - Performance metrics
- **Logs** tab - Error logs and debugging

## Rollback

To rollback to a previous deployment:

1. Go to Vercel project dashboard
2. Click "Deployments"
3. Find the previous working deployment
4. Click the "..." menu
5. Select "Promote to Production"

## Getting a Custom Helius API Key

If you want to use your own Helius API key instead of the default one:

1. Go to [helius.dev](https://helius.dev)
2. Sign up for a free account
3. Create a new API key
4. Set it as `VITE_HELIUS_API_KEY` in Vercel environment variables

## Support

For deployment issues:
- Check Vercel docs: https://vercel.com/docs
- Helius RPC docs: https://docs.helius.dev
- Solana docs: https://docs.solana.com

## Next Steps

After successful deployment:

1. **Test the live site** - Enter a Solana wallet address and verify it works
2. **Share your URL** - The deployment URL is shown in Vercel dashboard
3. **Monitor performance** - Check Vercel analytics regularly
4. **Update DNS** - If using a custom domain, verify it points correctly

## Continuous Deployment

If your code is in GitHub:

1. Push changes to your main branch
2. Vercel automatically detects and deploys
3. Preview deployments created for pull requests
4. Production deployment happens on merge to main

This provides automatic updates whenever you push code!
