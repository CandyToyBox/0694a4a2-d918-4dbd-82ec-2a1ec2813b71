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
        <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center mb-10">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet size={32} className="text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Find Your Claimable Funds</h2>
                <p className="text-slate-400 max-w-lg mx-auto mb-8">
                    Enter your SOL wallet address to scan the WaveWarz registry for any active battle shares or unclaimed winning payouts.
                </p>

                <form onSubmit={handleCheck} className="relative max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Enter Wallet Address (e.g. 6BKXG...)"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 px-6 pl-12 text-white text-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600"
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={24} />

                    <button
                        type="submit"
                        disabled={loading || !wallet}
                        className="absolute right-2 top-2 bottom-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Scan Wallet"}
                    </button>
                </form>
                {error && <p className="text-red-400 mt-4 flex items-center justify-center gap-2"><AlertTriangle size={16} /> {error}</p>}
            </div>

            {holdings && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-white">Scan Results ({holdings.length})</h3>
                    </div>

                    {holdings.length === 0 ? (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-10 text-center">
                            <CheckCircle2 size={48} className="text-slate-600 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-white">No Holdings Found</h4>
                            <p className="text-slate-500">This wallet does not appear to hold issues shares in any Active or Historical battles.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
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

    let statusColor = "text-slate-400";
    let statusIcon = <History size={16} />;
    let actionText = "No Action";

    if (holding.status === 'ACTIVE') {
        statusColor = "text-purple-400";
        statusIcon = <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />;
        actionText = "Sell to Withdraw";
    } else if (holding.status === 'WON') {
        statusColor = "text-emerald-400";
        statusIcon = <Coins size={16} />;
        actionText = "Claim Payout";
    } else if (holding.status === 'LOST') {
        statusColor = "text-red-400";
        actionText = "Battle Lost";
    }

    return (
        <div className={`bg-slate-900 border ${isActionable ? 'border-cyan-500/30' : 'border-slate-800'} p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 group hover:bg-slate-800/50 transition-colors`}>
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isActionable ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Coins size={24} />
                </div>
                <div>
                    <h4 className="text-white font-bold text-lg flex items-center gap-2">
                        Battle #{holding.battleId.toString()}
                        <span className={`text-xs px-2 py-0.5 rounded-full border border-current ${statusColor} opacity-80 flex items-center gap-1`}>
                            {statusIcon} {holding.status}
                        </span>
                    </h4>
                    <p className="text-slate-400 text-sm">
                        Holding <span className="text-white font-medium">{holding.amount} Shares</span> of Artist {holding.side}
                    </p>
                    <p className="text-slate-600 text-xs font-mono mt-0.5 max-w-[200px] truncate" title={holding.mint}>
                        Mint: {holding.mint}
                    </p>
                </div>
            </div>

            {isActionable && (
                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                    <a
                        href={`https://www.wavewarz.com/v2/battles/${holding.battleId.toString()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-6 rounded-lg transition-colors w-full md:w-auto flex items-center justify-center"
                    >
                        {actionText}
                    </a>
                    <p className="text-xs text-slate-500">
                        Go to active battle
                    </p>
                </div>
            )}
        </div>
    );
}

export default WalletChecker;
