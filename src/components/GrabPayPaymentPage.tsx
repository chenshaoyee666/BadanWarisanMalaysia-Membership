import { ArrowLeft, Smartphone, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface GrabPayPaymentPageProps {
    onBack: () => void;
    onSuccess: () => void;
    amount?: number;
}

export function GrabPayPaymentPage({ onBack, onSuccess, amount = 50 }: GrabPayPaymentPageProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePay = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onSuccess();
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-['Inter']">
            {/* Grab Header style */}
            <div className="bg-[#00B14F] px-4 py-4 flex items-center justify-between text-white shadow-sm">
                <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <span className="font-bold tracking-tight">GrabPay</span>
                <div className="w-8"></div> {/* Spacer for centering */}
            </div>

            <div className="flex-1 flex flex-col items-center p-6 text-center">
                <div className="mt-8 mb-6">
                    <div className="w-20 h-20 bg-[#00B14F] rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                        <span className="font-bold text-white text-xl">GRAB</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#333333]">RM{amount.toFixed(2)}</h2>
                    <p className="text-gray-500 text-sm mt-1">Badan Warisan Malaysia</p>
                </div>

                <div className="w-full max-w-xs bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center gap-4 mb-8">
                    <QrCode size={120} className="text-[#333333]" />
                    <p className="text-xs text-gray-400 font-medium">Scan QR code with Grab app</p>
                </div>

                <div className="relative w-full max-w-sm flex items-center justify-center mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <span className="relative bg-white px-4 text-sm text-gray-400 font-medium">OR</span>
                </div>

                <div className="w-full max-w-sm space-y-4">
                    <div className="bg-blue-50/50 p-4 rounded-xl flex items-center gap-4 text-left border border-blue-100">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Smartphone size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">Log in with Mobile Number</h3>
                            <p className="text-xs text-gray-500">Enter your number to pay</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-gray-100">
                <Button
                    onClick={handlePay}
                    disabled={isLoading}
                    className="w-full bg-[#00B14F] hover:bg-[#009b45] text-white h-14 rounded-full text-lg font-bold shadow-lg shadow-[#00B14F]/20"
                >
                    {isLoading ? 'Processing Payment...' : 'Pay Now'}
                </Button>
                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 mt-2"
                >
                    Cancel
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-2 max-w-xs mx-auto">
                    By clicking Pay Now, you agree to GrabPay's Terms of Service and Privacy Policy. a simulated payment.
                </p>
            </div>
        </div>
    );
}
