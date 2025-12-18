import { ArrowLeft } from 'lucide-react';

interface DonationHistoryProps {
  onNavigate: (screen: string) => void;
}

const donations = [
  {
    id: 1,
    campaign: 'Rumah Penghulu Restoration',
    date: '15 Oct 2025',
    amount: 'RM50.00',
  },
  {
    id: 2,
    campaign: 'Heritage Education Programme',
    date: '20 Sep 2025',
    amount: 'RM100.00',
  },
  {
    id: 3,
    campaign: 'Malacca Conservation Project',
    date: '5 Aug 2025',
    amount: 'RM75.00',
  },
  {
    id: 4,
    campaign: 'General Donation',
    date: '12 Jul 2025',
    amount: 'RM50.00',
  },
  {
    id: 5,
    campaign: 'Rumah Penghulu Restoration',
    date: '3 Jun 2025',
    amount: 'RM50.00',
  },
];

export function DonationHistory({ onNavigate }: DonationHistoryProps) {
  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* SUB-PAGE: Simple Header with Back Button */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center gap-4">
        <button onClick={() => onNavigate('profile')} className="text-[#FFFBEA]">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[#FFFBEA] font-['Lora'] flex-1 text-center mr-6">Donation History</h2>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-3">
          {donations.map((donation) => (
            <div key={donation.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-[#333333] font-['Inter'] mb-2">{donation.campaign}</h4>
                  <p className="text-[#333333] opacity-70 font-['Inter']">{donation.date}</p>
                </div>
                <p className="text-[#0A402F] font-['Inter']">{donation.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
