import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface MembershipViewCardProps {
  onNavigate: (screen: string) => void;
}

export function MembershipViewCard({ onNavigate }: MembershipViewCardProps) {
  const { user } = useAuth();
  
  // Get user's full name from metadata
  const userName = user?.user_metadata?.full_name || 'User';
  // Get membership ID from metadata (using member_id from raw_user_meta_data)
  const membershipId = user?.user_metadata?.member_id || 'BWM-12345';
  return (
    <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center">
        <button onClick={() => onNavigate('profile')} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-white font-['Lora'] flex-1 text-center mr-6">Membership</h2>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        {/* Digital Membership Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          {/* Card Header with Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-[#0A402F] rounded-lg flex items-center justify-center">
              <span className="text-[#FEFDF5] font-['Lora']">BWM</span>
            </div>
            <span className="text-[#B8860B]">MEMBER</span>
          </div>

          {/* Member Info */}
          <div className="mb-6">
            <h3 className="text-[#333333] font-['Lora'] mb-1">{userName}</h3>
            <p className="text-[#333333] opacity-70">Membership ID: {membershipId}</p>
            <p className="text-[#333333] opacity-70 mt-1">Valid until: Dec 31, 2025</p>
          </div>

          {/* QR Code */}
          <div className="bg-[#FEFDF5] rounded-xl p-6 flex items-center justify-center mb-4">
            <div className="w-40 h-40 bg-white border-2 border-[#333333] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                <rect x="0" y="0" width="20" height="20" fill="#333333"/>
                <rect x="25" y="0" width="20" height="20" fill="#333333"/>
                <rect x="55" y="0" width="20" height="20" fill="#333333"/>
                <rect x="80" y="0" width="20" height="20" fill="#333333"/>
                <rect x="0" y="25" width="20" height="20" fill="#333333"/>
                <rect x="80" y="25" width="20" height="20" fill="#333333"/>
                <rect x="0" y="55" width="20" height="20" fill="#333333"/>
                <rect x="30" y="55" width="20" height="20" fill="#333333"/>
                <rect x="55" y="55" width="20" height="20" fill="#333333"/>
                <rect x="80" y="55" width="20" height="20" fill="#333333"/>
                <rect x="0" y="80" width="20" height="20" fill="#333333"/>
                <rect x="25" y="80" width="20" height="20" fill="#333333"/>
                <rect x="55" y="80" width="20" height="20" fill="#333333"/>
                <rect x="80" y="80" width="20" height="20" fill="#333333"/>
              </svg>
            </div>
          </div>

          <p className="text-center text-[#333333] opacity-70">Show this QR code at events for free entry</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FEFDF5] h-12 rounded-lg">
            Renew Membership
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-2 border-[#0A402F] text-[#0A402F] hover:bg-[#0A402F]/5 h-12 rounded-lg"
          >
            View Benefits
          </Button>
        </div>

        {/* Member Benefits Section */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h4 className="text-[#333333] font-['Lora'] mb-4">Your Member Benefits</h4>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">✓</span>
              <span className="text-[#333333]">Free entry to all BWM events</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">✓</span>
              <span className="text-[#333333]">Quarterly heritage magazine</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">✓</span>
              <span className="text-[#333333]">10% discount at museum shops</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">✓</span>
              <span className="text-[#333333]">Exclusive member-only tours</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
