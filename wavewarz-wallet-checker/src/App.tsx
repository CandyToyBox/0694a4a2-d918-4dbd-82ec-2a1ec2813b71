import WalletChecker from './components/WalletChecker';

function App() {
    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <header className="mb-10 flex flex-col items-center gap-6 border-b border-cyan-500/30 pb-6">
                {/* WaveWarz Logo */}
                <img
                    src="/logo.png"
                    alt="WaveWarz"
                    className="h-20 md:h-28 object-contain drop-shadow-lg"
                    style={{
                        filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.5))'
                    }}
                    onError={(e) => {
                        // Fallback if logo doesn't exist
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />

                {/* Title and Description */}
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                        Wallet Checker
                    </h1>
                    <p className="text-cyan-300/70 text-sm md:text-base">Check your claimable battle shares and winnings</p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 text-xs text-green-400 font-mono border border-green-500/30 rounded-full px-4 py-2 bg-green-500/5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    CONNECTED: SOLANA MAINNET
                </div>
            </header>

            <main>
                <WalletChecker battles={[]} />
            </main>
        </div>
    );
}

export default App;
