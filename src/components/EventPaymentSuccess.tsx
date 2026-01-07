import { ArrowLeft, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Event } from '../types/event';

interface EventPaymentSuccessProps {
    onNavigate: (screen: string) => void;
    event: Event;
    registrationData: {
        name: string;
        email: string;
        phone: string;
    };
    amount: number;
}

export function EventPaymentSuccess({ onNavigate, event, registrationData, amount }: EventPaymentSuccessProps) {
    return (
        <div className="h-screen bg-[#FFFBEA] flex flex-col font-['Inter']">
            {/* Header */}
            <div className="bg-[#0A402F] px-4 py-4 flex items-center gap-4 text-white shrink-0 shadow-sm mb-6">
                <h1 className="text-xl font-medium font-['Lora']">Payment Complete</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-16 flex flex-col items-center">
                {/* Check Icon */}
                <div className="bg-green-100 p-6 rounded-full mb-6">
                    <Check size={48} className="text-green-600" />
                </div>

                <h2 className="text-[#333333] text-lg font-['Lora'] mb-2 font-medium">Payment Successful!</h2>
                <p className="text-gray-500 text-sm mb-6 text-center">Your registration has been confirmed</p>

                {/* Receipt Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg w-full mb-6">
                    <h3 className="text-[#333333] text-center mb-6 border-b border-gray-100 pb-2">Registration Receipt</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Applicant Name</span>
                            <span className="text-[#333333] font-medium text-right">{registrationData.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Event</span>
                            <span className="text-[#333333] font-medium text-right truncate max-w-[180px]">{event.title}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Date</span>
                            <span className="text-[#333333] font-medium text-right">{event.date}</span>
                        </div>
                        <div className="flex justify-between mt-4 items-center">
                            <span className="text-gray-500">Amount Paid</span>
                            <span className="text-[#0A402F] font-bold text-lg">RM {amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pb-8 space-y-3 bg-[#FFFBEA]">
                <Button
                    onClick={() => onNavigate('events')}
                    className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-12 rounded-xl text-lg font-medium"
                >
                    View My Events
                </Button>

                <button
                    onClick={() => onNavigate('home')}
                    className="w-full py-3 text-gray-500 text-sm font-medium"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
