import { ArrowLeft, Landmark, CreditCard, Wallet, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

// Duplicate definition - ideally should vary in shared file
const campaigns = [
  {
    idString: 'rumah-penghulu',
    title: 'Rumah Penghulu Restoration',
    image: 'https://images.unsplash.com/photo-1610794267125-da22a00fca8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxheXNpYW4lMjBoZXJpdGFnZSUyMGJ1aWxkaW5nJTIwcmVzdG9yYXRpb258ZW58MXx8fHwxNzYyNDMzNjQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    idString: 'heritage-education',
    title: 'Heritage Education Programme',
    image: 'https://images.unsplash.com/photo-1716016761758-85ee3d6c3c01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJpdGFnZSUyMGVkdWNhdGlvbiUyMGNoaWxkcmVuJTIwbXVzZXVtfGVufDF8fHx8MTc2MjQzMzY0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    idString: 'malacca-conservation',
    title: 'Malacca Conservation Project',
    image: 'https://images.unsplash.com/photo-1745865636112-3269c9fc40b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpYyUyMGJ1aWxkaW5nJTIwY29uc2VydmF0aW9ufGVufDF8fHx8MTc2MjQzMzY0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    idString: 'general-fund',
    title: 'General Heritage Fund',
    image: 'https://images.unsplash.com/photo-1685710734950-2f0c1ab9c04d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGhlcml0YWdlJTIwcHJlc2VydmF0aW9ufGVufDF8fHx8MTc2MjQzMzY0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

interface DonationDetailsScreenProps {
  onProceed: (amount: number, method: string) => void;
  onBack: () => void;
  data?: { campaignId?: string };
}

export function DonationDetailsScreen({ onProceed, onBack, data }: DonationDetailsScreenProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'fpx' | 'card' | 'grabpay' | null>('fpx');

  const campaign = campaigns.find(c => c.idString === data?.campaignId) || campaigns[0];

  // Amounts to display
  const amounts = [10, 50, 100, 200];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount) || 0;
    return 0;
  };

  const handleProceed = () => {
    const amount = getFinalAmount();
    if (amount <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    onProceed(amount, selectedPaymentMethod);
  };

  return (
    <div className="h-screen bg-[#FFFBEA] flex flex-col font-['Inter'] overflow-hidden">
      {/* Header */}
      <div className="bg-[#0A402F] px-4 py-4 flex items-center gap-4 text-white shrink-0">
        <button onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-medium font-['Lora']">Donation Details</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
        {/* Campaign Info */}
        <div className="mb-6">
          <h2 className="text-[#333333] text-lg font-bold font-['Lora'] mb-2">{campaign.title}</h2>
          <div className="bg-white p-2 rounded-2xl shadow-sm">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-8">
          <h2 className="text-[#333333] text-lg font-['Lora'] mb-3">Your Donation Impact</h2>
          <p className="text-[#333333] text-sm mb-4">How Your Donation Helps:</p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Landmark className="text-[#333333]" size={20} />
              </div>
              <div>
                <h3 className="text-[#333333] font-medium text-sm">Heritage Preservation</h3>
                <p className="text-[#333333] text-xs opacity-70 mt-1">Your contribution helps restore and maintain historic buildings, monuments, and cultural sites across Malaysia.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Landmark className="text-[#333333]" size={20} />
              </div>
              <div>
                <h3 className="text-[#333333] font-medium text-sm">Education Programs</h3>
                <p className="text-[#333333] text-xs opacity-70 mt-1">Fund educational initiatives that teach communities about Malaysian heritage and conservation.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Landmark className="text-[#333333]" size={20} />
              </div>
              <div>
                <h3 className="text-[#333333] font-medium text-sm">Conservation Projects</h3>
                <p className="text-[#333333] text-xs opacity-70 mt-1">Support active restoration work on traditional Malay houses, colonial buildings, and archaeological sites.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Landmark className="text-[#333333]" size={20} />
              </div>
              <div>
                <h3 className="text-[#333333] font-medium text-sm">Community Outreach</h3>
                <p className="text-[#333333] text-xs opacity-70 mt-1">Enable community engagement programs and heritage awareness campaigns nationwide.</p>
              </div>
            </div>
          </div>

          <p className="text-[#333333] text-xs opacity-70 mt-6">
            Tax Deductible: Badan Warisan Malaysia is a registered non-profit organization. Your donation may be tax deductible.
          </p>
        </div>


        {/* Amount Selection */}
        <div className="mb-6">
          <h2 className="text-[#333333] text-lg font-['Lora'] mb-4">Select Amount</h2>
          <div className="space-y-3">
            {amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`w-full py-3 rounded-xl border transition-all ${selectedAmount === amount
                  ? 'bg-[#0A402F] text-white border-[#0A402F]'
                  : 'bg-white text-[#333333] border-gray-200 hover:border-[#0A402F]/50'
                  }`}
              >
                RM{amount}
              </button>
            ))}

            <input
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className={`w-full py-3 px-4 rounded-xl border outline-none transition-all ${customAmount
                ? 'border-[#0A402F] bg-white'
                : 'border-gray-200 bg-white focus:border-[#0A402F]'
                }`}
            />
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h2 className="text-[#333333] text-lg font-['Lora'] mb-4">Select Payment Method:</h2>
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
              className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedPaymentMethod === 'grabpay'
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
          <span className="text-[#333333] opacity-70">Total Donation</span>
          <span className="text-[#333333] text-lg font-bold">RM{getFinalAmount().toFixed(2)}</span>
        </div>
        <Button
          onClick={handleProceed}
          className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-white h-12 rounded-xl text-lg"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
