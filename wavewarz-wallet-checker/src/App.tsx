import WalletChecker from './components/WalletChecker';

function App() {
    return (
        <div className="min-h-screen bg-black text-white p-3 sm:p-4 md:p-6 lg:p-8">
            <header className="mb-6 sm:mb-8 md:mb-10 flex flex-col items-center gap-3 sm:gap-4 md:gap-6 border-b border-cyan-500/30 pb-4 sm:pb-5 md:pb-6">
                {/* WaveWarz Logo */}
                <img
                    src="/logo.png"
                    alt="WaveWarz"
                    className="h-16 sm:h-20 md:h-24 lg:h-28 object-contain drop-shadow-lg w-full max-w-xs"
                    style={{
                        filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.5))'
                    }}
                    onError={(e) => {
                        // Fallback if logo doesn't exist
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />

                {/* Title and Description */}
                <div className="text-center w-full px-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-300 bg-clip-text text-transparent mb-1 sm:mb-2 leading-tight">
                        Wallet Checker
                    </h1>
                    <p className="text-cyan-300/70 text-xs sm:text-sm md:text-base lg:text-lg">Check your claimable battle shares and winnings</p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 text-xs sm:text-xs md:text-sm text-green-400 font-mono border border-green-500/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500/5 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></span>
                    <span className="hidden sm:inline">CONNECTED:</span> SOLANA MAINNET
                </div>
            </header>

            <main className="w-full">
                <WalletChecker battles={[]} />
            </main>
        </div>
    );
}

export default App;
