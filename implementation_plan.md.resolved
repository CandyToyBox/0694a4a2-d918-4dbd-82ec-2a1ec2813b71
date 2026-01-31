# Implementation Plan - WaveWarz Analytics Dashboard

## Goal Description
Build a high-fidelity, real-time analytics dashboard for WaveWarz that bypasses standard indexers to read directly from the Solana Program (`9TUfEHvk5fN5vogtQyrefgNqzKy2Bqb4nWVhSFUg2fYo`). The system will provide "Official Battle Registry" fidelity with "Live" blockchain latency using Helius RPC.

## User Review Required
- **Helius API Key**: Will need to be supplied via `.env` (`VITE_HELIUS_API_KEY`).
- **Supabase Credentials**: Required for the "Persistent Log" layer if fully implemented (URL/Anon Key).
- **Deployment**: User to confirm Vercel deployment credentials/process.

## Proposed Changes

### Project Structure
New directory: `scratch/wavewarz-analytics`

### 1. Blockchain Service Layer (`src/services/blockchain/`)
The core functionality requested.
- **`pda.ts`**: Utilities for determining Program Derived Addresses.
    - `getBattleAddress(battleId)`: `['battle', u64_le(battleId)]`
    - `getVaultAddress(battleId)`: `['battle_vault', u64_le(battleId)]`
- **`parser.ts`**: Zero-copy deserialization of AccountInfo.
    - Custom offsets for `start_time`, `end_time`, `total_distribution_amount`.
    - `BattleAccount` interface definition based on IDL.
- **`helius.ts`**: RPC wrapper.
    - `fetchBattleState(battleId)`
    - `fetchBattleVolume(battleId)`: Aggregating NativeTransfers on vault PDAs.

### 2. Logic Engine (`src/services/analytics/`)
- **`roi.ts`**: Implementation of the specific settlement formulas.
    - Winner/Loser Splits (40/50/5/2/3).
    - Fee Calculation (1% / 0.5%).
- **`volume.ts`**: Transaction parsing logic.
    - `buyShares` vs `sellShares` discriminator matching.

### 3. Data Infrastructure (`src/services/data/`)
- **`static.ts`**: In-memory registry of known battles (UUIDs, Metadata) as a fallback/seed.
- **`supabase.ts`**: Client for the "Official Battle Registry Log".

### 4. UI Architecture (`src/components/`)
- **`Dashboard.tsx`**: Main entry, "Live Battle" focus.
- **`BattleCard.tsx`**: Visualizing detailed stats.
- **`VolumeChart.tsx`**: Recharts implementation for Time-Series Volatility.
- **`SettlementSimulator.tsx`**: Reactive state machine for ROI inputs.

## Verification Plan

### Automated Tests
- N/A for this phase (Manual verification preferred by user for visual components).

### Manual Verification
1. **PDA Check**: Verify derived addresses match known block explorer links.
2. **Data Consistency**: Compare "Live" values against `get_wavewarz_volume` script outputs.
3. **ROI Logic**: Input known pool sizes and verify calculator output matches the "Blueprint" examples.
