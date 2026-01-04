import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import AdminDashboard from './AdminDashboard';

interface AdminPortalProps {
    onBack: () => void;
}

export default function AdminPortal({ onBack }: AdminPortalProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '88888888') {
            setIsAuthenticated(true);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    if (isAuthenticated) {
        return <AdminDashboard />;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
            <form onSubmit={handleLogin} className="flex flex-col items-center w-full max-w-xs animate-in fade-in zoom-in duration-300">

                {/* ID Input */}
                <div className="w-full mb-5">
                    <input
                        autoFocus
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter 8-digit ID"
                        maxLength={8}
                        className={`w-full px-6 py-3.5 rounded-xl border-[1.5px] outline-none text-center text-lg font-mono tracking-widest transition-all placeholder:font-sans placeholder:tracking-normal placeholder:text-gray-400 ${error
                                ? 'border-red-400 text-red-900 bg-red-50'
                                : 'border-[#10B981] text-gray-700 bg-white focus:ring-4 focus:ring-[#10B981]/10'
                            }`}
                    />
                </div>

                {/* Verify Button */}
                <button
                    type="submit"
                    className="w-full text-white py-3.5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 active:scale-95 hover:brightness-95"
                    style={{ backgroundColor: '#78Cbc0' }} // Matching the soft green from screenshot
                    disabled={password.length === 0}
                >
                    Verify <ArrowRight size={20} strokeWidth={2.5} />
                </button>

                {/* Back Link */}
                <button
                    type="button"
                    onClick={onBack}
                    className="mt-8 text-sm text-gray-400 underline decoration-gray-300 underline-offset-4 hover:text-gray-600 transition-colors"
                >
                    Back
                </button>
            </form>
        </div>
    );
}