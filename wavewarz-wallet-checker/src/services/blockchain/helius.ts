import { Connection, PublicKey } from '@solana/web3.js';
import { getBattleAddress, PROGRAM_ID } from './pda';
import { parseBattleAccount, BattleAccount } from './parser';

const API_KEY = import.meta.env.VITE_HELIUS_API_KEY || "311ab6c5-2a28-43d6-b0e4-2782fee7b915";
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`;
const connection = new Connection(RPC_URL);

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple rate limiter queue
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 300; // ms

async function rateLimitedFetch<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const timeSinceLast = now - lastRequestTime;

    if (timeSinceLast < MIN_REQUEST_INTERVAL) {
        await wait(MIN_REQUEST_INTERVAL - timeSinceLast);
    }

    lastRequestTime = Date.now();
    return fn();
}

/**
 * Fetches and parses the live Battle Account state directly from Solana
 * Includes exponential backoff for 429s
 */
export async function fetchLiveBattleState(battleId: number | bigint): Promise<BattleAccount | null> {
    const battleAddress = getBattleAddress(battleId);
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            return await rateLimitedFetch(async () => {
                const accountInfo = await connection.getAccountInfo(battleAddress);
                if (!accountInfo) return null;
                return parseBattleAccount(accountInfo.data);
            });
        } catch (error: any) {
            if (error.message?.includes('429')) {
                attempts++;
                const delay = 1000 * Math.pow(2, attempts); // 2s, 4s, 8s
                console.warn(`Hit 429 rate limit. Retrying in ${delay}ms... (Attempt ${attempts}/${maxAttempts})`);
                await wait(delay);
                continue;
            }
            console.error(`Failed to fetch battle ${battleId}:`, error);
            return null;
        }
    }
    return null;
}

/**
 * Fetches total volume (simulated for now, as real volume requires transaction parsing depth
 * that we might do in a separate focused function like the scripts)
 */
export async function fetchBattleVolume(battleId: number | bigint) {
    const state = await fetchLiveBattleState(battleId);
    if (!state) return { tvlA: 0n, tvlB: 0n, total: 0n };

    return {
        tvlA: state.artistASolBalance,
        tvlB: state.artistBSolBalance,
        total: state.artistASolBalance + state.artistBSolBalance
    };
}

/**
 * Fetches user token accounts and cross-references them with the provided battles list
 * to find any Battle Shares (Active or Settled) held by the user.
 */
export interface UserHolding {
    battleId: bigint;
    mint: string;
    amount: number;
    side: 'A' | 'B';
    status: 'ACTIVE' | 'WON' | 'LOST' | 'INACTIVE';
    valueSol?: number; // Estimated redeemable value
}

export async function fetchUserHoldings(walletAddress: string, battles: BattleAccount[]): Promise<UserHolding[]> {
    try {
        const pubkey = new PublicKey(walletAddress);

        // 1. Map Mints to Battles for O(1) lookup
        const mintMap = new Map<string, { battle: BattleAccount, side: 'A' | 'B' }>();
        battles.forEach(b => {
            mintMap.set(b.artistAMint.toBase58(), { battle: b, side: 'A' });
            mintMap.set(b.artistBMint.toBase58(), { battle: b, side: 'B' });
        });

        // 2. Fetch User Token Accounts (Parsed)
        // We look for Token Program v2 (standard) accounts
        const response = await rateLimitedFetch(() => connection.getParsedTokenAccountsByOwner(pubkey, {
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        }));

        const holdings: UserHolding[] = [];

        response.value.forEach((item: any) => {
            const info = item.account.data.parsed.info;
            const mint = info.mint;
            const amount = info.tokenAmount.uiAmount;

            if (amount > 0 && mintMap.has(mint)) {
                const { battle, side } = mintMap.get(mint)!;

                let status: UserHolding['status'] = 'INACTIVE';

                if (battle.isActive) {
                    status = 'ACTIVE';
                } else if (battle.winnerDecided) {
                    const isWinner = (side === 'A' && battle.winnerArtistA) || (side === 'B' && !battle.winnerArtistA);
                    status = isWinner ? 'WON' : 'LOST';
                }

                // Estimated Value (Simplified)
                // If Active: Value ~ Proportional share of Pool Balance
                // If Won: Value ~ Proportional share of Total Distribution
                // If Lost: 0
                // Note: Logic for exact share price is complex (bonding curve).
                // We'll leave valueSol undefined/rough for now or implement if needed.
                // For "Claims", just knowing you have it is enough.

                holdings.push({
                    battleId: battle.battleId,
                    mint,
                    amount,
                    side,
                    status
                });
            }
        });

        return holdings;

    } catch (error) {
        console.error("Error fetching user holdings:", error);
        return [];
    }
}

/**
 * Fetches ALL battles from the program
 * CAUTION: This can be heavy if there are thousands of battles.
 */
export async function fetchAllBattles(): Promise<BattleAccount[]> {
    try {
        // Fetch all accounts owned by the program
        // We know they are Battle accounts (generally size ~353)
        const accounts = await rateLimitedFetch(() => connection.getProgramAccounts(PROGRAM_ID));

        const battles: BattleAccount[] = [];

        for (const { account } of accounts) {
            try {
                // Determine if it's a battle account by size or successful parsing
                if (account.data.length < 100) continue; // Skip small accounts (metadata etc)

                const battle = parseBattleAccount(account.data);
                if (battle) {
                    battles.push(battle);
                }
            } catch (e) {
                // Ignore parsing errors for non-battle accounts
            }
        }

        return battles;
    } catch (error) {
        console.error("Failed to fetch all battles:", error);
        return [];
    }
}
