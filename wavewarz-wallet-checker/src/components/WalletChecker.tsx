import React, { useState } from 'react';
import { fetchUserHoldings, UserHolding, fetchAllBattles } from '../services/blockchain/helius';
import { BattleAccount } from '../services/blockchain/parser';
import { Search, Loader2, Wallet, Coins, AlertTriangle, CheckCircle2, History } from 'lucide-react';

interface WalletCheckerProps {
    battles: BattleAccount[]; // Pass active battles context if available, or we fetch
}

function WalletChecker({ battles: preloadedBattles }: WalletCheckerProps) {
    const [wallet, setWallet] = useState('');
    const [loading, setLoading] = useState(false);
    const [holdings, setHoldings] = useState<UserHolding[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wallet) return;

        // Basic validation
        if (wallet.length < 32) {
            setError("Invalid wallet address length");
            return;
        }

        setLoading(true);
        setError(null);
        setHoldings(null);

        try {
            // If parent didn't pass battles, we might need to fetch them (though Dashboard usually passes them)
            // But to be robust, let's assume parent passed them or we fetch ONLY if missing.
            let battleList = preloadedBattles;
            if (!battleList || battleList.length === 0) {
                battleList = await fetchAllBattles();
            }

            const results = await fetchUserHoldings(wallet, battleList);

            // Sort: ACTIVE/WON first (Actionable), then LOST/INACTIVE
            results.sort((a, b) => {
                const score = (status: string) => {
                    if (status === 'WON') return 3;
                    if (status === 'ACTIVE') return 2;
                    return 0;
                };
                return score(b.status) - score(a.status);
            });

            setHoldings(results);
        } catch (err: any) {
            console.error(err);
            setError("Failed to scan wallet. Ensure address is correct.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-0">
            <div className="bg-black/40 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center mb-6 sm:mb-8 md:mb-10 backdrop-blur-sm">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-cyan-500/50">
                    <Wallet size={24} className="text-white sm:w-8 sm:h-8 md:w-8 md:h-8" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2 sm:mb-3">Find Your Claimable Funds</h2>
                <p className="text-cyan-300/70 text-xs sm:text-sm md:text-base max-w-lg mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
                    Enter your SOL wallet address to scan the WaveWarz registry for any active battle shares or unclaimed winning payouts.
                </p>

                <form onSubmit={handleCheck} className="relative max-w-lg mx-auto px-2 sm:px-0 flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Enter Wallet Address"
                            className="w-full bg-black/50 border border-cyan-500/50 rounded-lg sm:rounded-l-xl py-3 sm:py-4 px-4 sm:px-6 pl-10 sm:pl-12 text-white text-sm sm:text-base md:text-lg focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-cyan-400/50"
                            value={wallet}
                            onChange={(e) => setWallet(e.target.value)}
                        />
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-cyan-400/70 w-4 h-4 sm:w-6 sm:h-6" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !wallet}
                        className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black text-sm sm:text-base font-bold px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-r-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 w-full sm:w-auto"
                    >
                        {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <span className="hidden sm:inline">Scan Wallet</span>}
                        {loading ? <span className="sm:hidden">Scanning...</span> : <span className="sm:hidden">Scan</span>}
                    </button>
                </form>
                {error && <p className="text-red-400 mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm"><AlertTriangle size={16} /> {error}</p>}
            </div>

            {holdings && (
                <div className="space-y-3 sm:space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-2 sm:px-0">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">Scan Results ({holdings.length})</h3>
                    </div>

                    {holdings.length === 0 ? (
                        <div className="bg-black/40 border border-cyan-500/30 rounded-lg sm:rounded-xl p-6 sm:p-8 md:p-10 text-center backdrop-blur-sm">
                            <CheckCircle2 size={40} className="text-cyan-400/40 mx-auto mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12" />
                            <h4 className="text-base sm:text-lg font-medium text-white mb-2">No Holdings Found</h4>
                            <p className="text-cyan-300/70 text-sm sm:text-base">This wallet does not appear to hold issues shares in any Active or Historical battles.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:gap-4">
                            {holdings.map((h) => (
                                <HoldingCard key={h.mint} holding={h} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function HoldingCard({ holding }: { holding: UserHolding }) {
    const isActionable = holding.status === 'ACTIVE' || holding.status === 'WON';

    let statusColor = "text-cyan-300/70";
    let statusIcon = <History size={16} />;
    let actionText = "No Action";

    if (holding.status === 'ACTIVE') {
        statusColor = "text-green-400";
        statusIcon = <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
        actionText = "Sell to Withdraw";
    } else if (holding.status === 'WON') {
        statusColor = "text-green-400";
        statusIcon = <Coins size={16} />;
        actionText = "Claim Payout";
    } else if (holding.status === 'LOST') {
        statusColor = "text-red-400";
        actionText = "Battle Lost";
    }

    return (
        <div className={`bg-black/40 border ${isActionable ? 'border-green-500/50' : 'border-cyan-500/20'} p-3 sm:p-4 md:p-5 rounded-lg md:rounded-xl flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between group hover:bg-black/60 transition-colors backdrop-blur-sm`}>
            <div className="flex items-start gap-3 sm:gap-4 w-full md:w-auto">
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${isActionable ? 'bg-gradient-to-br from-cyan-500 to-green-500 text-white' : 'bg-cyan-500/10 text-cyan-400'}`}>
                    <Coins size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center gap-1 sm:gap-2 flex-wrap">
                        Battle #{holding.battleId.toString()}
                        <span className={`text-xs px-2 py-0.5 rounded-full border border-current ${statusColor} opacity-90 flex items-center gap-1 flex-shrink-0`}>
                            {statusIcon} {holding.status}
                        </span>
                    </h4>
                    <p className="text-cyan-300/70 text-xs sm:text-sm mt-1">
                        Holding <span className="text-white font-medium">{holding.amount} Shares</span> of Artist {holding.side}
                    </p>
                    <p className="text-cyan-400/50 text-xs font-mono mt-1 truncate" title={holding.mint}>
                        Mint: {holding.mint}
                    </p>
                </div>
            </div>

            {isActionable && (
                <div className="flex flex-col items-end gap-1 sm:gap-2 w-full md:w-auto md:flex-shrink-0">
                    <a
                        href={`https://www.wavewarz.com/v2/battles/${holding.battleId.toString()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black text-xs sm:text-sm font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors w-full md:w-auto flex items-center justify-center shadow-lg shadow-green-500/20"
                    >
                        {actionText}
                    </a>
                    <p className="text-xs text-cyan-400/50">
                        Go to active battle
                    </p>
                </div>
            )}
        </div>
    );
}

export default WalletChecker;
