import { ArrowLeft, CreditCard, Check, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface MembershipRenewalPaymentProps {
    onNavigate: (screen: string) => void;
}

// Tier pricing info
const TIER_PRICES: Record<string, { annual: number; label: string }> = {
    'Ordinary Member': { annual: 90, label: 'Annual Fee' },
    'Student Member': { annual: 20, label: 'Annual Fee (Student)' },
    'Corporate Member': { annual: 2500, label: 'Annual Fee (Corporate)' },
};

export function MembershipRenewalPayment({ onNavigate }: MembershipRenewalPaymentProps) {
    const { user } = useAuth();
    const [membershipData, setMembershipData] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        fetchMembership();
    }, [user]);

    const fetchMembership = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('memberships')
                .select('*')
                .eq('user_id', user.id)
                .limit(1)
                .single();

            if (!error && data) {
                setMembershipData(data);
            }
        } catch (err) {
            console.error('Error fetching membership:', err);
        }
    };

    const handlePayment = async () => {
        if (!membershipData?.id) {
            toast.error('No membership found');
            return;
        }

        setIsProcessing(true);

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // Calculate new expiry date (1 year from now)
            const newExpiryDate = new Date();
            newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

            const { error } = await supabase
                .from('memberships')
                .update({
                    expires_at: newExpiryDate.toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', membershipData.id);

            if (error) throw error;

            setPaymentSuccess(true);
            toast.success('Payment successful! Membership renewed.');

            // Navigate after a short delay to show success
            setTimeout(() => {
                onNavigate('membership');
            }, 2000);

        } catch (error: any) {
            console.error('Error processing payment:', error);
            toast.error(error.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const tierInfo = membershipData?.tier
        ? TIER_PRICES[membershipData.tier] || { annual: 90, label: 'Annual Fee' }
        : { annual: 90, label: 'Annual Fee' };

    const newExpiryDate = new Date();
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

    return (
        <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
            {/* Header */}
            <header className="bg-[#0A402F] px-4 py-4 flex items-center">
                <button onClick={() => onNavigate('membership')} className="text-[#FEFDF5] mr-4">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-[#FEFDF5] font-['Lora']">Renew Membership</h2>
            </header>

            {/* Content */}
            <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full">

                {paymentSuccess ? (
                    // Success State
                    <div className="flex flex-col items-center justify-center h-full py-12">
                        <div className="bg-green-100 p-6 rounded-full mb-6 animate-in zoom-in duration-500">
                            <Check size={48} className="text-green-600" />
                        </div>
                        <h3 className="text-[#333333] font-['Lora'] text-xl font-bold mb-2">Payment Successful!</h3>
                        <p className="text-gray-500 text-center">
                            Your membership has been renewed until<br />
                            <span className="font-bold text-[#0A402F]">
                                {newExpiryDate.toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </p>
                        <p className="text-gray-400 text-sm mt-4">Redirecting...</p>
                    </div>
                ) : (
                    <>
                        {/* Order Summary Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                            <h3 className="text-[#333333] font-['Lora'] font-bold mb-4 flex items-center gap-2">
                                <Shield size={20} className="text-[#B8860B]" />
                                Renewal Summary
                            </h3>

                            <div className="space-y-3 border-b border-gray-100 pb-4 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Current Tier</span>
                                    <span className="font-medium text-[#333333]">{membershipData?.tier || 'Loading...'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Member Name</span>
                                    <span className="font-medium text-[#333333]">{membershipData?.full_name || 'Loading...'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">New Expiry Date</span>
                                    <span className="font-medium text-[#0A402F]">
                                        {newExpiryDate.toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">{tierInfo.label}</span>
                                <span className="text-2xl font-bold text-[#0A402F]">RM{tierInfo.annual}</span>
                            </div>
                        </div>

                        {/* Payment Method Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                            <h4 className="text-[#333333] font-['Lora'] font-bold mb-4">Payment Method</h4>

                            {/* Simulated payment options */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 border-2 border-[#0A402F] rounded-xl bg-[#0A402F]/5 cursor-pointer">
                                    <input type="radio" name="payment" defaultChecked className="accent-[#0A402F]" />
                                    <CreditCard size={24} className="text-[#0A402F]" />
                                    <div>
                                        <p className="font-medium text-[#333333]">Credit/Debit Card</p>
                                        <p className="text-xs text-gray-500">Visa, Mastercard, AMEX</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-[#0A402F]/50">
                                    <input type="radio" name="payment" className="accent-[#0A402F]" />
                                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">FPX</div>
                                    <div>
                                        <p className="font-medium text-[#333333]">Online Banking (FPX)</p>
                                        <p className="text-xs text-gray-500">All major Malaysian banks</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Demo Notice */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                            <p className="text-yellow-800 text-sm text-center">
                                🎭 <strong>Demo Mode:</strong> No real payment will be processed.<br />
                                Click "Pay Now" to simulate a successful transaction.
                            </p>
                        </div>

                        {/* Pay Button */}
                        <Button
                            onClick={handlePayment}
                            disabled={isProcessing || !membershipData}
                            className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-14 rounded-xl text-lg font-bold shadow-lg"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                <>Pay RM{tierInfo.annual} Now</>
                            )}
                        </Button>

                        {/* Cancel Link */}
                        <button
                            onClick={() => onNavigate('membership')}
                            className="w-full text-center text-gray-500 mt-4 hover:text-[#0A402F]"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </main>
        </div>
    );
}
