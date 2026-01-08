import { ArrowLeft, Ticket, RefreshCw, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { MembershipCard } from './MembershipCard';
import { TicketCard } from './TicketCard';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface MembershipViewCardProps {
  onNavigate: (screen: string) => void;
}

export function MembershipViewCard({ onNavigate }: MembershipViewCardProps) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [membershipData, setMembershipData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get user's full name from metadata as fallback
  const userName = user?.user_metadata?.full_name || 'User';

  useEffect(() => {
    if (user) {
      fetchTickets();
      fetchMembership();
    }
  }, [user]);

  const fetchMembership = async () => {
    setIsLoading(true);
    try {
      // First, try to get ANY membership for this user (for debugging)
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      console.log('Membership fetch result:', { data, error }); // DEBUG

      if (!error && data) {
        setMembershipData(data);
      } else {
        console.warn('No membership found or error:', error);
      }
    } catch (err) {
      console.error("Error fetching membership:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          events (
            title,
            date,
            location
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'valid')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  // State for renewal confirmation modal
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  // Get tier pricing
  const getTierPrice = (tier: string) => {
    const prices: Record<string, number> = {
      'Ordinary Member': 90,
      'Student Member': 20,
      'Corporate Member': 2500,
    };
    return prices[tier] || 90;
  };

  const newExpiryDate = new Date();
  newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

  return (
    <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center">
        <button onClick={() => onNavigate('home')} className="text-[#FEFDF5] mr-4">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[#FEFDF5]">Membership</h2>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        {/* Digital Membership Card */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center text-gray-500 mb-6 animate-pulse">
            Loading membership...
          </div>
        ) : (
          <MembershipCard
            user={{
              fullName: membershipData?.full_name || userName,
              companyName: membershipData?.company_name,
              membershipId: membershipData?.membership_number || membershipData?.id || 'NOT REGISTERED',
              id: user?.id,
              tier: membershipData?.tier || 'Member'
            }}
            className="mb-6"
          />
        )}

        {/* Active Tickets Section */}
        {tickets.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#333333] font-['Lora'] mb-4 flex items-center gap-2">
              <Ticket size={20} className="text-[#B8860B]" />
              Your Active Tickets
            </h3>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => setShowRenewalModal(true)}
            disabled={!membershipData}
            className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FEFDF5] h-12 rounded-lg"
          >
            <RefreshCw size={18} className="mr-2" />
            Renew Membership
          </Button>

          <Button
            onClick={() => {
              // Set flag in localStorage so MembershipRegistration knows it's an upgrade
              localStorage.setItem('membershipUpgradeMode', 'true');
              onNavigate('membership-register');
            }}
            variant="outline"
            disabled={!membershipData}
            className="w-full border-2 border-[#0A402F] text-[#0A402F] hover:bg-[#0A402F]/5 h-12 rounded-lg"
          >
            <Edit size={18} className="mr-2" />
            Change Tier
          </Button>
        </div>

        {/* Renewal Confirmation Modal */}
        {showRenewalModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowRenewalModal(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-[#333333] font-['Lora'] text-xl font-bold mb-4 text-center">
                🔄 Renew Your Membership?
              </h3>

              <div className="bg-[#FEFDF5] rounded-xl p-4 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Tier</span>
                  <span className="font-bold text-[#333333]">{membershipData?.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Renewal Fee</span>
                  <span className="font-bold text-[#0A402F]">RM{getTierPrice(membershipData?.tier)}/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">New Expiry</span>
                  <span className="font-bold text-[#B8860B]">
                    {newExpiryDate.toLocaleDateString('en-MY', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowRenewalModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowRenewalModal(false);
                    onNavigate('membership-renewal-payment');
                  }}
                  className="flex-1 bg-[#0A402F] hover:bg-[#0A402F]/90"
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
        )}

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
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">✓</span>
              <span className="text-[#333333]">Free tours at Rumah Penghulu Abu Seman</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
