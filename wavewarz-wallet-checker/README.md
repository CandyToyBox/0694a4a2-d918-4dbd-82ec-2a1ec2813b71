# WaveWarz Wallet Claim Checker

A standalone Solana blockchain application to check and manage your claimable battle shares and winnings from WaveWarz.

## Features

- **Wallet Scanning**: Enter your Solana wallet address to scan for battle shares
- **Real-time Status**: See active battles, won shares, lost battles, and inactive holdings
- **Quick Actions**: Direct links to claim payouts or sell shares on wavewarz.com
- **Live Blockchain Data**: Connects to Solana mainnet via Helius RPC

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- A Solana wallet address to check

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## How to Use

1. Enter your Solana wallet address in the input field
2. Click "Scan Wallet" to search for your battle shares
3. View results showing:
   - **ACTIVE**: Shares in ongoing battles (can sell)
   - **WON**: Shares in won battles (can claim payout)
   - **LOST**: Shares in lost battles (no action)
   - **INACTIVE**: Historical holdings

4. Click the action button to go to the battle on wavewarz.com

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_HELIUS_API_KEY=your_helius_api_key_here
```

The API key is used for Solana mainnet RPC calls via Helius.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will auto-detect the configuration and build the project
4. Set environment variables in Vercel dashboard
5. Deploy!

Or use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## Technical Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Solana Web3.js** - Blockchain interaction
- **Lucide React** - Icons

## License

MIT
