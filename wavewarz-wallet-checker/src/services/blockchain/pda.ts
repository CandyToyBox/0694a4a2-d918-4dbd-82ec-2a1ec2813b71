import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey("9TUfEHvk5fN5vogtQyrefgNqzKy2Bqb4nWVhSFUg2fYo");

/**
 * Converts a number to a u64 Little-Endian Uint8Array
 */
export function toU64LE(num: number | bigint): Uint8Array {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setBigUint64(0, BigInt(num), true); // true = littleEndian
    return new Uint8Array(buffer);
}

/**
 * Derives the Battle PDA
 * Seeds: ["battle", battle_id_u64_le]
 */
export function getBattleAddress(battleId: number | bigint): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
        [
            new TextEncoder().encode("battle"),
            toU64LE(battleId)
        ],
        PROGRAM_ID
    );
    return pda;
}

/**
 * Derives the Battle Vault PDA
 * Seeds: ["battle_vault", battle_id_u64_le]
 */
export function getBattleVaultAddress(battleId: number | bigint): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
        [
            new TextEncoder().encode("battle_vault"),
            toU64LE(battleId)
        ],
        PROGRAM_ID
    );
    return pda;
}
