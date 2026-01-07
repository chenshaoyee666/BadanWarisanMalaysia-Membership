import { ArrowLeft, CheckCircle2, Scan } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface GrabPayPaymentPageProps {
    onBack: () => void;
    onSuccess: () => void;
    amount?: number;
}

// Simple QR Code visual component (demo purposes)
function DemoQRCode({ size = 160 }: { size?: number }) {
    const pattern = [
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
        [0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
        [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1],
        [0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1],
    ];

    return (
        <div className="bg-white p-4 rounded-2xl" style={{ width: size + 32, height: size + 32 }}>
            <svg width={size} height={size} viewBox={`0 0 ${pattern.length} ${pattern.length}`}>
                {pattern.map((row, y) =>
                    row.map((cell, x) =>
                        cell === 1 ? (
                            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#1a1a1a" />
                        ) : null
                    )
                )}
            </svg>
        </div>
    );
}

export function GrabPayPaymentPage({ onBack, onSuccess, amount = 50 }: GrabPayPaymentPageProps) {
    const [step, setStep] = useState<'scan' | 'processing'>('scan');

    // Generate a random reference code
    const refCode = 'BWM-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const handlePaymentComplete = () => {
        setStep('processing');
        setTimeout(() => {
            onSuccess();
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-[#FEFDF5] flex flex-col font-['Inter']">
            {/* Header - Dark Green Navigation Bar */}
            <header className="bg-[#0A402F] px-4 py-4 flex items-center">
                <button onClick={onBack} className="text-[#FEFDF5] mr-4">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-[#FEFDF5] font-['Lora']">GrabPay</h2>
            </header>

            {step === 'scan' && (
                <main className="flex-1 flex flex-col overflow-y-auto">
                    {/* Green Section - QR Code */}
                    <div className="px-6 py-8 flex flex-col items-center" style={{ backgroundColor: '#00B14F' }}>
                        {/* GrabPay Logo Text */}
                        <h1 className="text-3xl font-bold mb-5 mt-4" style={{ color: 'white' }}>
                            <span className="font-black">Grab</span>Pay
                        </h1>

                        {/* Subtitle */}
                        <p className="text-center text-sm mb-4 leading-relaxed" style={{ color: 'white' }}>
                            Scan with your Grab app.<br />
                            Pay with GrabPay Credits.
                        </p>

                        {/* Amount */}
                        <div className="rounded-full px-2 py-2 mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                            <span className="font-bold text-lg" style={{ color: 'white' }}>RM {amount.toFixed(2)}</span>
                        </div>

                        {/* QR Code */}
                        <DemoQRCode size={160} />

                        {/* Reference Code */}
                        <p className="text-xs font-mono mt-4" style={{ color: 'rgba(255,255,255,0.8)' }}>{refCode}</p>
                    </div>

                    {/* Green Section - How it works (continuation of green) */}
                    <div className="flex-1 px-3 py-3" style={{ backgroundColor: '#00B14F' }}>
                        <h3 className="text-center font-bold text-lg mb-3" style={{ color: 'white' }}>How it works</h3>

                        {/* Steps */}
                        <div className="rounded-2xl px-8 py-5 mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                            <div className="flex justify-between gap-3">
                                {/* Step 1 */}
                                <div className="flex-1 text-center mt-4 mb-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Scan size={20} style={{ color: '#00B14F' }} />
                                    </div>
                                    <p className="font-bold text-xs mb-1" style={{ color: 'white' }}>Step 1</p>
                                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Tap Scan icon<br />at top left</p>
                                </div>

                                {/* Step 2 */}
                                <div className="flex-1 text-center mt-4 mb-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="font-bold text-lg" style={{ color: '#00B14F' }}>📱</span>
                                    </div>
                                    <p className="font-bold text-xs mb-1" style={{ color: 'white' }}>Step 2</p>
                                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Scan the<br />QR code</p>
                                </div>

                                {/* Step 3 */}
                                <div className="flex-1 text-center mt-4 mb-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="font-bold text-lg" style={{ color: '#00B14F' }}>RM</span>
                                    </div>
                                    <p className="font-bold text-xs mb-1" style={{ color: 'white' }}>Step 3</p>
                                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Enter RM<br />amount</p>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <Button
                            onClick={handlePaymentComplete}
                            className="w-full h-12 rounded-xl font-bold"
                            style={{ backgroundColor: 'white', color: '#00B14F' }}
                        >
                            I've Completed Payment
                        </Button>

                        <button
                            onClick={onBack}
                            className="w-full py-3 text-sm mt-2"
                            style={{ color: 'rgba(255,255,255,0.8)' }}
                        >
                            Cancel Payment
                        </button>
                    </div>
                </main>
            )}

            {step === 'processing' && (
                <main className="flex-1 flex flex-col items-center justify-center px-6 bg-[#00B14F]">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} className="text-[#00B14F]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Processing Payment</h3>
                    <p className="text-white/80 text-sm mb-6">Confirming your payment...</p>
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </main>
            )}
        </div>
    );
}
