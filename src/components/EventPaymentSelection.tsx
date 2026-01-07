import { ArrowLeft, CreditCard, Landmark, Check, Calendar, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Event } from '../types/event';

interface EventPaymentSelectionProps {
    onProceed: (method: string) => void;
    onBack: () => void;
    event: Event;
    registrationData: {
        name: string;
        email: string;
        phone: string;
    };
    amount: number;
}

export function EventPaymentSelection({ onProceed, onBack, event, registrationData, amount }: EventPaymentSelectionProps) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'fpx' | 'card' | 'grabpay' | null>('fpx');

    const handleProceed = () => {
        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }

        onProceed(selectedPaymentMethod);
    };

    return (
        <div className="h-screen bg-[#FFFBEA] flex flex-col font-['Inter'] overflow-hidden">
            {/* Header */}
            <div className="bg-[#0A402F] px-4 py-4 flex items-center gap-4 text-white shrink-0">
                <button onClick={onBack}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-medium font-['Lora']">Payment Summary</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">

                {/* Bill Summary / Event Details */}
                <div className="mb-8">
                    <h2 className="text-[#333333] text-lg font-['Lora'] mb-3">Bill Summary</h2>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex flex-col mb-4">
                            <img
                                src={event.poster_url}
                                alt={event.title}
                                className="w-full h-48 rounded-xl object-cover mb-4"
                            />
                            <div>
                                <h3 className="text-[#333333] font-bold text-xl mb-2">{event.title}</h3>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Calendar size={16} className="text-[#B48F5E]" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <MapPin size={16} className="text-[#B48F5E]" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-3"></div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Applicant Name</span>
                                <span className="text-[#333333] font-medium text-right">{registrationData.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Email</span>
                                <span className="text-[#333333] font-medium text-right">{registrationData.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phone</span>
                                <span className="text-[#333333] font-medium text-right">{registrationData.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-8">
                    <h2 className="text-[#333333] text-lg font-['Lora'] mb-4 mt-4">Select Payment Method:</h2>
                    <div className="space-y-3">
                        {/* FPX */}
                        <button
                            onClick={() => setSelectedPaymentMethod('fpx')}
                            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedPaymentMethod === 'fpx'
                                ? 'bg-[#E8F5E9] border-[#0A402F]'
                                : 'bg-white border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Landmark className="text-[#333333]" size={20} />
                                </div>
                                <span className="text-[#333333] font-medium">FPX Online Banking</span>
                            </div>
                            {selectedPaymentMethod === 'fpx' && (
                                <div className="w-6 h-6 bg-[#0A402F] rounded-full flex items-center justify-center">
                                    <Check size={14} className="text-white" />
                                </div>
                            )}
                        </button>

                        {/* Card */}
                        <button
                            onClick={() => setSelectedPaymentMethod('card')}
                            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedPaymentMethod === 'card'
                                ? 'bg-[#E8F5E9] border-[#0A402F]'
                                : 'bg-white border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <CreditCard className="text-[#333333]" size={20} />
                                </div>
                                <span className="text-[#333333] font-medium">Credit / Debit Card</span>
                            </div>
                            {selectedPaymentMethod === 'card' && (
                                <div className="w-6 h-6 bg-[#0A402F] rounded-full flex items-center justify-center">
                                    <Check size={14} className="text-white" />
                                </div>
                            )}
                        </button>

                        {/* GrabPay */}
                        <button
                            onClick={() => setSelectedPaymentMethod('grabpay')}
                            className={`mb-3 w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedPaymentMethod === 'grabpay'
                                ? 'bg-[#E8F5E9] border-[#0A402F]'
                                : 'bg-white border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-[#333333]">GRAB</span>
                                </div>
                                <span className="text-[#333333] font-medium">GrabPay</span>
                            </div>
                            {selectedPaymentMethod === 'grabpay' && (
                                <div className="w-6 h-6 bg-[#0A402F] rounded-full flex items-center justify-center">
                                    <Check size={14} className="text-white" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Spacer for bottom padding */}
                <div className="h-[120px]"></div>
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-white border-t border-gray-200 p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[#333333] opacity-70">Total Amount</span>
                    <span className="text-[#333333] text-lg font-bold">RM{amount.toFixed(2)}</span>
                </div>
                <Button
                    onClick={handleProceed}
                    className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-12 rounded-xl text-lg"
                >
                    Pay RM{amount.toFixed(2)}
                </Button>
            </div>
        </div>
    );
}
