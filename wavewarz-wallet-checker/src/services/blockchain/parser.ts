import { PublicKey } from '@solana/web3.js';

export interface BattleAccount {
    battleId: bigint;
    startTime: bigint;
    endTime: bigint;
    artistAWallet: PublicKey;
    artistBWallet: PublicKey;
    wavewarzWallet: PublicKey;
    artistAMint: PublicKey;
    artistBMint: PublicKey;
    artistASupply: bigint;
    artistBSupply: bigint;
    artistASolBalance: bigint; // TVL A
    artistBSolBalance: bigint; // TVL B
    artistAPool: bigint;
    artistBPool: bigint;
    winnerArtistA: boolean;
    winnerDecided: boolean;
    isInitialized: boolean;
    isActive: boolean;
    totalDistributionAmount: bigint;
}

/**
 * Custom DataView Parser for WaveWarz Battle Account
 * Uses native DataView for browser compatibility (no Buffer polyfill needed).
 */
export function parseBattleAccount(data: Uint8Array | Buffer): BattleAccount {
    // Ensure we have a DataView
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

    // Anchor accounts have an 8-byte discriminator prefix
    let offset = 8;

    const battleId = view.getBigUint64(offset, true); offset += 8;

    // Bumps (4 x u8)
    offset += 1; // battleBump
    offset += 1; // artistAMintBump
    offset += 1; // artistBMintBump
    offset += 1; // battleVaultBump

    const startTime = view.getBigInt64(offset, true); offset += 8;
    const endTime = view.getBigInt64(offset, true); offset += 8;

    const artistAWallet = new PublicKey(data.subarray(offset, offset + 32)); offset += 32;
    const artistBWallet = new PublicKey(data.subarray(offset, offset + 32)); offset += 32;
    const wavewarzWallet = new PublicKey(data.subarray(offset, offset + 32)); offset += 32;

    const artistAMint = new PublicKey(data.subarray(offset, offset + 32)); offset += 32;
    const artistBMint = new PublicKey(data.subarray(offset, offset + 32)); offset += 32;

    const artistASupply = view.getBigUint64(offset, true); offset += 8;
    const artistBSupply = view.getBigUint64(offset, true); offset += 8;

    const artistASolBalance = view.getBigUint64(offset, true); offset += 8;
    const artistBSolBalance = view.getBigUint64(offset, true); offset += 8;

    const artistAPool = view.getBigUint64(offset, true); offset += 8;
    const artistBPool = view.getBigUint64(offset, true); offset += 8;

    const winnerArtistA = view.getUint8(offset) !== 0; offset += 1;
    const winnerDecided = view.getUint8(offset) !== 0; offset += 1;

    // transaction_state (enum)
    offset += 1;

    const isInitialized = view.getUint8(offset) !== 0; offset += 1;
    const isActive = view.getUint8(offset) !== 0; offset += 1;

    const totalDistributionAmount = view.getBigUint64(offset, true); offset += 8;

    return {
        battleId,
        startTime,
        endTime,
        artistAWallet,
        artistBWallet,
        wavewarzWallet,
        artistAMint,
        artistBMint,
        artistASupply,
        artistBSupply,
        artistASolBalance,
        artistBSolBalance,
        artistAPool,
        artistBPool,
        winnerArtistA,
        winnerDecided,
        isInitialized,
        isActive,
        totalDistributionAmount
    };
}
