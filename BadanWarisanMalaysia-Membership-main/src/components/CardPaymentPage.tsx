import { ArrowLeft, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface CardPaymentPageProps {
    onBack: () => void;
    onSuccess: () => void;
    amount?: number;
}

export function CardPaymentPage({ onBack, onSuccess, amount = 50 }: CardPaymentPageProps) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        }
        return value;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length <= 16) {
            setCardNumber(val);
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 2) {
            val = val.substring(0, 2) + '/' + val.substring(2, 4);
        }
        if (val.length <= 5) {
            setExpiry(val);
        }
    };

    const handlePay = () => {
        if (cardNumber.length < 16 || expiry.length < 5 || cvc.length < 3 || !name) {
            alert('Please fill in all card details correctly');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onSuccess();
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#FFFBEA] flex flex-col font-['Inter']">
            <div className="bg-[#0A402F] px-4 py-4 flex items-center gap-4 text-white shadow-sm">
                <button onClick={onBack}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-medium font-['Lora']">Card Payment</h1>
            </div>

            <div className="flex-1 p-4 pb-24 overflow-y-auto">
                {/* Visual Card */}
                <div className="bg-gradient-to-br from-[#0A402F] to-[#145d46] rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <CreditCard size={120} />
                    </div>

                    <div className="relative z-10 flex flex-col h-40 justify-between">
                        <div className="flex justify-between items-start">
                            <ShieldCheck size={28} className="text-yellow-400" />
                            <span className="font-mono text-sm opacity-80">DEBIT / CREDIT</span>
                        </div>

                        <div className="space-y-4">
                            <div className="font-mono text-2xl tracking-widest text-shadow">
                                {cardNumber ? formatCardNumber(cardNumber) : '•••• •••• •••• ••••'}
                            </div>
                            <div className="flex justify-between text-sm items-end bg-black/20 p-2 rounded-lg backdrop-blur-sm">
                                <div>
                                    <div className="text-[10px] opacity-70 uppercase tracking-wider">Card Holder</div>
                                    <div className="font-medium uppercase truncate max-w-[150px]">{name || 'YOUR NAME'}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] opacity-70 uppercase tracking-wider">Expires</div>
                                    <div className="font-mono">{expiry || 'MM/YY'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">Card Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formatCardNumber(cardNumber)}
                                onChange={handleCardNumberChange}
                                placeholder="0000 0000 0000 0000"
                                className="w-full p-4 pl-12 rounded-xl border border-gray-200 bg-white focus:border-[#0A402F] outline-none font-mono"
                            />
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">Card Holder Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name on card"
                            className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:border-[#0A402F] outline-none uppercase"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-[#333333] mb-2">Expiry Date</label>
                            <input
                                type="text"
                                value={expiry}
                                onChange={handleExpiryChange}
                                placeholder="MM/YY"
                                className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:border-[#0A402F] outline-none text-center font-mono"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-[#333333] mb-2">CVC / CVC2</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                                    placeholder="123"
                                    className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:border-[#0A402F] outline-none text-center font-mono"
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-xs">
                    <Lock size={12} />
                    <span>Payments are secure and encrypted</span>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-bold text-[#0A402F] text-lg">RM{amount.toFixed(2)}</span>
                </div>
                <Button
                    onClick={handlePay}
                    disabled={isLoading}
                    className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-12 rounded-xl text-lg flex items-center justify-between px-6"
                >
                    <span>{isLoading ? 'Processing...' : 'Pay Now'}</span>
                    {!isLoading && <ArrowLeft className="rotate-180" size={20} />}
                </Button>
            </div>
        </div>
    );
}
