import { Activity } from 'lucide-react';
import WalletChecker from './components/WalletChecker';

function App() {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <header className="mb-10 flex flex-col md:flex-row md:items-center gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-cyan-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-purple-500/20">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            WaveWarz Wallet Checker
                        </h1>
                        <p className="text-slate-400 text-sm">Check your claimable battle shares and winnings</p>
                    </div>
                </div>
                <div className="md:ml-auto flex items-center gap-3 text-xs text-slate-500 font-mono">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
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
