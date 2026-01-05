// src/components/AdminVerificationScreen.tsx
import { useState } from 'react';
import { Lock, ChevronLeft, KeyRound, AlertCircle } from 'lucide-react';

interface AdminVerificationProps {
    onNavigate: (screen: string) => void;
}

export const AdminVerificationScreen = ({ onNavigate }: AdminVerificationProps) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate a brief network delay for realism
        setTimeout(() => {
            // HARDCODED PASSWORD CHECK
            if (password === '88888888') {
                onNavigate('admin'); // Navigate to the actual Admin Dashboard
            } else {
                setError('Access Denied: Incorrect Password');
                setPassword('');
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#052e1f] via-[#0A402F] to-[#052e1f] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            {/* Ambient Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#2C6A5D] rounded-full blur-[120px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#1a4a3a] rounded-full blur-[120px] opacity-30 pointer-events-none" />

            {/* Header with Back Button */}
            <div className="absolute top-0 left-0 w-full p-6 z-20">
                <button
                    onClick={() => onNavigate('profile')}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-all group"
                >
                    <div className="bg-white/10 p-2.5 rounded-full backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="font-medium tracking-wide text-sm">Return to Profile</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-sm px-8 relative z-10 flex flex-col items-center">
                <div className="bg-[#FFFBEA] p-8 rounded-[2rem] shadow-2xl shadow-black/20 w-full flex flex-col items-center relative overflow-hidden">
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-[#0A402F] via-[#2C6A5D] to-[#0A402F]" />

                    {/* Lock Icon */}
                    <div className="bg-[#0A402F] p-4 rounded-2xl mb-5 shadow-lg shadow-[#0A402F]/20">
                        <Lock size={28} strokeWidth={2} className="text-[#FFFBEA]" />
                    </div>

                    <h2 className="text-2xl font-bold text-[#0A402F] font-['Lora'] mb-3 tracking-tight">
                        Admin Portal
                    </h2>
                    <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed font-medium">
                        Secure access for Badan Warisan Malaysia administrators.
                    </p>

                    <form onSubmit={handleVerify} className="w-full space-y-4">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0A402F] transition-colors pointer-events-none">
                                <KeyRound size={20} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Access Key"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#0A402F] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0A402F]/10 transition-all text-[#0A402F] font-bold text-lg placeholder:text-gray-300 placeholder:font-medium tracking-widest text-center"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 text-xs font-bold justify-center bg-red-50 py-3 rounded-lg animate-in fade-in slide-in-from-top-1 border border-red-100">
                                <AlertCircle size={14} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || password.length === 0}
                            className="w-full bg-[#0A402F] text-[#FFFBEA] py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#0A402F]/20 hover:shadow-2xl hover:shadow-[#0A402F]/30 active:scale-[0.98] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 bg-[#FFFBEA] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-[#FFFBEA] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-[#FFFBEA] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </span>
                            ) : (
                                'Unlock Portal'
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-xs text-white/30 font-medium tracking-widest uppercase">
                    Badan Warisan Malaysia &copy; 2026
                </p>
            </div>
        </div>
    );
};
