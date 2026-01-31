# WaveWarz Analytics Dashboard - Walkthrough

I have successfully built the standalone analytics dashboard that connects directly to the Solana blockchain for real-time WaveWarz data.

## What Was Built

### 1. High-Performance Blockchain Layer
- **Direct RPC Connection**: Bypasses slow indexers by connecting directly to Helius RPC nodes.
- **Zero-Copy Parsing**: Custom `DataView` parser decodes on-chain battle accounts instantly without heavy IDL libraries.
- **PDA Derivation**: Automatic calculation of Battle and Vault addresses using the correct Little-Endian `u64` encoding.

### 2. Analytics Engine
- **Volume Tracking**: Real-time TVL calculation based on vault balances.
- **ROI Simulator**: Implemented the exact distribution formulas (40/50/5/2/3 split) for accurate payout projections.

### 3. Live Dashboard UI
- **Global Program Stats**: Displays Total Battles, Active Battles, Live TVL, and Estimated Volume across the entire program history.
- **Paginated Grid**: Efficiently handles 126+ battles with client-side pagination.
- **Search Functionality**: Look up any battle by ID.

![Dashboard Stats](/Users/samanthakinney/.gemini/antigravity/brain/0694a4a2-d918-4dbd-82ec-2a1ec2813b71/uploaded_media_1769881144542.png)

## Verification
- **Build Status**: ✅ `npm run build` passed successfully.
- **Data Integrity**: ✅ Successfully fetched 126+ battles from Mainnet.
- **Performance**: ✅ Rate limiting prevents 429 errors; Pagination ensures UI responsiveness.

## How to Run Locally

1. Navigate to the project directory:
   ```bash
   cd scratch/wavewarz-analytics
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

## Deployment Steps (Vercel)

1. **Push to GitHub**: Initialize a repo and push the code.
2. **Import to Vercel**: select the repository in Vercel.
3. **Environment Variables**: Add your Helius API Key:
   - `VITE_HELIUS_API_KEY`: `311ab6c5-2a28-43d6-b0e4-2782fee7b915`
4. **Deploy**: Click deploy.

