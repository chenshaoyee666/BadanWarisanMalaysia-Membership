import { ArrowLeft, Check, Lock, Building2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface FPXPaymentPageProps {
    onBack: () => void;
    onSuccess: () => void;
    amount?: number;
}

export function FPXPaymentPage({ onBack, onSuccess, amount = 50 }: FPXPaymentPageProps) {
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [step, setStep] = useState<'select' | 'login' | 'confirm'>('select');
    const [isLoading, setIsLoading] = useState(false);

    const banks = [
        { id: 'maybank', name: 'Maybank2u', color: '#FFC800', textColor: '#000', secondaryColor: '#FFF0B3' },
        { id: 'cimb', name: 'CIMB Clicks', color: '#ED1C24', textColor: '#FFF', secondaryColor: '#FBD2D4' },
        { id: 'public', name: 'Public Bank', color: '#CD1221', textColor: '#FFF', secondaryColor: '#F5C2C6' },
        { id: 'rhb', name: 'RHB Now', color: '#0067B1', textColor: '#FFF', secondaryColor: '#CCE0F0' },
        { id: 'hongleong', name: 'Hong Leong Connect', color: '#004A99', textColor: '#FFF', secondaryColor: '#CCDBEB' },
        { id: 'ambank', name: 'AmBank', color: '#ED1C24', textColor: '#FFF', secondaryColor: '#FBD2D4' }
    ];

    const currentBank = banks.find(b => b.id === selectedBank);

    const handleBankSelect = (bankId: string) => {
        setSelectedBank(bankId);
    };

    const handleProceedToLogin = () => {
        if (!selectedBank) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('login');
        }, 1000);
    };

    const handleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('confirm');
        }, 1500);
    };

    const handleConfirmPayment = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onSuccess();
        }, 2000);
    };

    if (step === 'login') {
        const bankColor = currentBank?.color || '#0A402F';
        const bankTextColor = currentBank?.textColor || '#FFF';

        return (
            <div className="min-h-screen bg-gray-100 flex flex-col font-['Inter']">
                <div
                    className="bg-[#0A402F] px-4 py-4 flex items-center justify-between text-white shadow-md transition-colors duration-500"
                    style={{ backgroundColor: bankColor, color: bankTextColor }}
                >
                    <div className="flex items-center gap-3">
                        <button onClick={() => setStep('select')}>
                            <ArrowLeft size={20} />
                        </button>
                        <span className="font-medium">FPX Secure Gateway</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-90 text-xs bg-black/10 px-2 py-1 rounded">
                        <ShieldCheck size={14} />
                        <span>Secured</span>
                    </div>
                </div>

                <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden z-10 border border-gray-100">
                        {/* Bank Branding Header */}
                        <div className="p-8 pb-4 flex flex-col items-center relative">
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mb-4 shadow-lg transform transition-transform"
                                style={{ backgroundColor: bankColor, color: bankTextColor }}
                            >
                                <Building2 size={40} />
                            </div>
                            <h3 className="text-center font-bold text-gray-800 text-xl tracking-tight">
                                {currentBank?.name}
                            </h3>
                            <p className="text-center text-gray-500 text-sm">Internet Banking</p>
                        </div>

                        <div className="px-8 pb-8 pt-2 space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide ml-1">Username</label>
                                    <input
                                        type="text"
                                        defaultValue="testuser"
                                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="Enter your username"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide ml-1">Password</label>
                                    <input
                                        type="password"
                                        defaultValue="password123"
                                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex gap-3 items-start">
                                    <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-800">
                                        <span className="font-semibold block mb-0.5">Secure Transaction</span>
                                        Your connection is encrypted and secure.
                                    </p>
                                </div>

                                <Button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    style={{ backgroundColor: bankColor, color: bankTextColor }}
                                    className="w-full h-12 rounded-lg font-medium shadow-md hover:opacity-90 transition-opacity mt-2"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                            Authenticating...
                                        </span>
                                    ) : 'Login Securely'}
                                </Button>
                            </div>

                            <p className="text-[10px] text-center text-gray-400">
                                By logging in, you agree to the Terms & Conditions of {currentBank?.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'confirm') {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col font-['Inter'] relative">
                <div className="absolute inset-0 z-0 bg-[#0A402F] h-64"></div>

                <div className="relative z-10 flex-1 flex flex-col p-6">
                    <div className="flex items-center gap-3 text-white mb-8">
                        <span className="font-medium text-lg">Transaction Confirmation</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm mx-auto w-full relative">
                        {/* Receipt Top Edge Decoration */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"></div>

                        <div className="p-8 text-center border-b border-dashed border-gray-200 pb-8">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4 border border-green-100">
                                <Building2 size={32} />
                            </div>
                            <h2 className="text-gray-900 text-3xl font-bold tracking-tight mb-1">RM {amount.toFixed(2)}</h2>
                            <p className="text-gray-500 text-sm font-medium">Payment to Badan Warisan Malaysia</p>
                        </div>

                        <div className="p-8 space-y-4 bg-gray-50/50">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">From Account</span>
                                <span className="font-semibold text-gray-900 text-right max-w-[180px]">{currentBank?.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Reference ID</span>
                                <span className="font-mono text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded text-xs">
                                    BWM-{Math.floor(Math.random() * 1000000)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Date & Time</span>
                                <span className="font-medium text-gray-900">{new Date().toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Zigzag bottom border effect using CSS pattern could go here, simulating simple line for now */}
                        <div className="h-4 bg-gray-50/50 border-t border-dashed border-gray-200 relative -mb-2"></div>

                        <div className="p-6">
                            <Button
                                onClick={handleConfirmPayment}
                                disabled={isLoading}
                                className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-12 rounded-xl text-base shadow-lg shadow-teal-900/10 transition-all font-medium"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Processing...
                                    </span>
                                ) : 'Confirm & Pay'}
                            </Button>

                            <button
                                onClick={() => setStep('select')}
                                className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
                            >
                                Cancel Transaction
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBEA] flex flex-col font-['Inter']">
            <div className="bg-[#0A402F] sticky top-0 z-20 px-4 py-4 flex items-center gap-4 text-white shadow-sm">
                <button onClick={onBack} className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold font-['Lora'] leading-tight">Select Bank</h1>
                    <span className="text-xs text-secondary-foreground/70 opacity-80">FPX Secure Gateway</span>
                </div>
            </div>

            <div className="flex-1 p-5 pb-24 overflow-y-auto w-full max-w-lg mx-auto">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#0A402F]/10 mb-5">
                    <h3 className="font-semibold text-[#0A402F] text-sm mb-1">Payment Details</h3>
                    <div className="flex justify-between items-end">
                        <span className="text-xs text-gray-500">Total Amount</span>
                        <span className="text-xl font-bold text-[#333333]">RM {amount.toFixed(2)}</span>
                    </div>
                </div>

                <p className="text-[#333333] mb-4 opacity-70 text-sm font-medium px-1">
                    Choose your preferred bank:
                </p>

                <div className="grid grid-cols-2 gap-3">
                    {banks.map((bank) => (
                        <button
                            key={bank.id}
                            onClick={() => handleBankSelect(bank.id)}
                            className={`relative p-4 rounded-xl border flex flex-col items-center justify-center gap-3 h-32 transition-all duration-200 group ${selectedBank === bank.id
                                    ? 'border-[#0A402F] ring-2 ring-[#0A402F]/10 bg-white shadow-md transform scale-[1.02]'
                                    : 'border-transparent bg-white shadow-sm hover:shadow-md hover:border-gray-200'
                                }`}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm transition-transform group-hover:scale-110"
                                style={{ backgroundColor: bank.color, color: bank.textColor }}
                            >
                                {bank.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-center text-[#333333] group-hover:text-[#0A402F] transition-colors line-clamp-2 leading-tight">
                                {bank.name}
                            </span>

                            {selectedBank === bank.id && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-[#0A402F] rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-200">
                                    <Check size={12} className="text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-200/60 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <Button
                    onClick={handleProceedToLogin}
                    disabled={!selectedBank || isLoading}
                    className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-12 rounded-xl text-base disabled:opacity-50 font-semibold shadow-lg shadow-teal-900/10 transition-all active:scale-[0.98]"
                >
                    {isLoading ? 'Processing...' : 'Continue to Secure Login'}
                </Button>
            </div>
        </div>
    );
}
