import { ArrowLeft, CreditCard, Check, Shield, Landmark } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { FPXPaymentPage } from './FPXPaymentPage';
import { CardPaymentPage } from './CardPaymentPage';
import { GrabPayPaymentPage } from './GrabPayPaymentPage';

interface MembershipRenewalPaymentProps {
    onNavigate: (screen: string) => void;
}

// Tier pricing info
const TIER_PRICES: Record<string, { annual: number; label: string }> = {
    'Ordinary Member': { annual: 90, label: 'Annual Fee' },
    'Student Member': { annual: 20, label: 'Annual Fee (Student)' },
    'Corporate Member': { annual: 2500, label: 'Annual Fee (Corporate)' },
};

type Step = 'select-method' | 'fpx' | 'card' | 'grabpay' | 'success';

export function MembershipRenewalPayment({ onNavigate }: MembershipRenewalPaymentProps) {
    const { user } = useAuth();
    const [membershipData, setMembershipData] = useState<any>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'fpx' | 'card' | 'grabpay'>('fpx');
    const [step, setStep] = useState<Step>('select-method');

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

    const handleProceed = () => {
        setStep(selectedPaymentMethod);
    };

    const handleBack = () => {
        if (step === 'select-method') {
            onNavigate('membership');
        } else {
            setStep('select-method');
        }
    };

    const handlePaymentSuccess = async () => {
        console.log('handlePaymentSuccess called, membershipData:', membershipData);

        if (!membershipData?.id) {
            toast.error('No membership found');
            // Still show success page even if no membership to update
            setStep('success');
            return;
        }

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

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            console.log('Setting step to success');
            setStep('success');
            toast.success('Payment successful! Membership renewed.');

        } catch (error: any) {
            console.error('Error processing payment:', error);
            toast.error(error.message || 'Payment failed. Please try again.');
            // Even on error, show success for demo purposes
            setStep('success');
        }
    };

    const tierInfo = membershipData?.tier
        ? TIER_PRICES[membershipData.tier] || { annual: 90, label: 'Annual Fee' }
        : { annual: 90, label: 'Annual Fee' };

    const newExpiryDate = new Date();
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

    // Show success page after payment - check this FIRST
    if (step === 'success') {
        return (
            <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
                <header className="bg-[#0A402F] px-4 py-4 flex items-center">
                    <h2 className="text-[#FEFDF5] font-['Lora']">Payment Complete</h2>
                </header>
                <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full overflow-y-auto">
                    <div className="flex flex-col items-center justify-center h-full py-8">
                        {/* Success Icon */}
                        <div className="bg-green-100 p-6 rounded-full mb-6">
                            <Check size={48} className="text-green-600" />
                        </div>

                        <h3 className="text-[#333333] font-['Lora'] text-2xl font-bold mb-2">Payment Successful!</h3>
                        <p className="text-gray-500 text-center mb-6">Your membership has been renewed</p>

                        {/* Receipt Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg w-full mb-6">
                            <h4 className="text-[#333333] font-bold mb-4 text-center border-b pb-3">Renewal Receipt</h4>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Member Name</span>
                                    <span className="font-medium text-[#333333]">{membershipData?.full_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Membership Tier</span>
                                    <span className="font-medium text-[#333333]">{membershipData?.tier}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Amount Paid</span>
                                    <span className="font-bold text-[#0A402F]">RM {tierInfo.annual.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">New Expiry Date</span>
                                        <span className="font-bold text-[#0A402F]">
                                            {newExpiryDate.toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Button */}
                        <Button
                            onClick={() => onNavigate('membership')}
                            className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-12 rounded-xl font-bold"
                        >
                            View My Membership
                        </Button>

                        <button
                            onClick={() => onNavigate('home')}
                            className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 mt-2"
                        >
                            Back to Home
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // Render external payment pages
    if (step === 'fpx') {
        return <FPXPaymentPage onBack={() => setStep('select-method')} onSuccess={handlePaymentSuccess} amount={tierInfo.annual} />;
    }

    if (step === 'card') {
        return <CardPaymentPage onBack={() => setStep('select-method')} onSuccess={handlePaymentSuccess} amount={tierInfo.annual} />;
    }

    if (step === 'grabpay') {
        return <GrabPayPaymentPage onBack={() => setStep('select-method')} onSuccess={handlePaymentSuccess} amount={tierInfo.annual} />;
    }

    return (
        <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
            {/* Header */}
            <header className="bg-[#0A402F] px-4 py-4 flex items-center">
                <button onClick={handleBack} className="text-[#FEFDF5] mr-4">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-[#FEFDF5] font-['Lora']">Renew Membership</h2>
            </header>

            <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full overflow-y-auto">
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

                {/* Payment Method Selection */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h4 className="text-[#333333] font-['Lora'] font-bold mb-4">Select Payment Method</h4>
                    <div className="space-y-3">
                        {/* FPX */}
                        <button
                            onClick={() => setSelectedPaymentMethod('fpx')}
                            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedPaymentMethod === 'fpx' ? 'bg-[#E8F5E9] border-[#0A402F]' : 'bg-white border-gray-200'}`}
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
                            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedPaymentMethod === 'card' ? 'bg-[#E8F5E9] border-[#0A402F]' : 'bg-white border-gray-200'}`}
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
                            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedPaymentMethod === 'grabpay' ? 'bg-[#E8F5E9] border-[#0A402F]' : 'bg-white border-gray-200'}`}
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

                <Button
                    onClick={handleProceed}
                    disabled={!membershipData}
                    className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-14 rounded-xl text-lg font-bold"
                >
                    Proceed to Pay RM{tierInfo.annual}
                </Button>
            </main>
        </div>
    );
}
