import { ArrowLeft, Check, Lock, Building2 } from 'lucide-react';
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
        { id: 'maybank', name: 'Maybank2u', color: '#FFC800', textColor: '#000' },
        { id: 'cimb', name: 'CIMB Clicks', color: '#ED1C24', textColor: '#FFF' },
        { id: 'public', name: 'Public Bank', color: '#CD1221', textColor: '#FFF' },
        { id: 'rhb', name: 'RHB Now', color: '#0067B1', textColor: '#FFF' },
        { id: 'hongleong', name: 'Hong Leong Connect', color: '#004A99', textColor: '#FFF' },
        { id: 'ambank', name: 'AmBank', color: '#ED1C24', textColor: '#FFF' }
    ];

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
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col font-['Inter']">
                <div className="bg-[#0A402F] px-4 py-4 flex items-center justify-between text-white shadow-md">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setStep('select')}>
                            <ArrowLeft size={20} />
                        </button>
                        <span className="font-medium">FPX Secure Gateway</span>
                    </div>
                    <Lock size={16} className="opacity-80" />
                </div>

                <div className="flex-1 p-6 flex flex-col items-center justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-sm border border-gray-100">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Building2 size={32} />
                            </div>
                        </div>

                        <h3 className="text-center font-bold text-gray-800 text-lg mb-1">
                            {banks.find(b => b.id === selectedBank)?.name}
                        </h3>
                        <p className="text-center text-gray-500 text-sm mb-6">Simulated secure login</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Username</label>
                                <input type="text" defaultValue="testuser" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
                                <input type="password" defaultValue="password123" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                            </div>

                            <p className="text-xs text-center text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                                This is a secure simulation. No real money will be deducted.
                            </p>

                            <Button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-11 rounded-lg mt-2"
                            >
                                {isLoading ? 'Authenticating...' : 'Login'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'confirm') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col font-['Inter']">
                <div className="bg-[#0A402F] px-4 py-4 flex items-center gap-3 text-white shadow-md">
                    <span className="font-medium">Confirm Payment</span>
                </div>

                <div className="flex-1 p-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <span className="block text-center text-gray-500 text-xs uppercase tracking-wider mb-1">Payment Amount</span>
                            <h2 className="text-center text-3xl font-bold text-[#0A402F]">RM{amount.toFixed(2)}</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500 text-sm">Merchant</span>
                                <span className="font-medium text-sm text-right">Badan Warisan Malaysia</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500 text-sm">Reference ID</span>
                                <span className="font-medium text-sm text-right">BWM-{Math.floor(Math.random() * 1000000)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500 text-sm">Date</span>
                                <span className="font-medium text-sm text-right">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="p-6 pt-2">
                            <Button
                                onClick={handleConfirmPayment}
                                disabled={isLoading}
                                className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-12 rounded-xl text-lg"
                            >
                                {isLoading ? 'Processing...' : 'Confirm & Pay'}
                            </Button>
                            <div className="mt-3 text-center">
                                <button onClick={() => setStep('select')} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBEA] flex flex-col font-['Inter']">
            <div className="bg-[#0A402F] px-4 py-4 flex items-center gap-4 text-white">
                <button onClick={onBack}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-medium font-['Lora']">Select Bank (FPX)</h1>
            </div>

            <div className="flex-1 p-4 pb-24 overflow-y-auto">
                <p className="text-[#333333] mb-4 opacity-70">
                    Select your preferred bank to proceed with secure online banking payment.
                </p>

                <div className="grid grid-cols-2 gap-3">
                    {banks.map((bank) => (
                        <button
                            key={bank.id}
                            onClick={() => handleBankSelect(bank.id)}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 h-32 transition-all ${selectedBank === bank.id
                                    ? 'border-[#0A402F] ring-2 ring-[#0A402F]/20 bg-white'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs"
                                style={{ backgroundColor: bank.color, color: bank.textColor }}
                            >
                                {bank.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-xs font-medium text-center text-[#333333]">{bank.name}</span>
                            {selectedBank === bank.id && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-[#0A402F] rounded-full flex items-center justify-center">
                                    <Check size={12} className="text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-4">
                <Button
                    onClick={handleProceedToLogin}
                    disabled={!selectedBank || isLoading}
                    className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-12 rounded-xl text-lg disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : 'Secure Checkout'}
                </Button>
            </div>
        </div>
    );
}
