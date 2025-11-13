import { ChevronRight, CreditCard, History, Settings, LogOut, Bell, User as UserIcon, Home, DollarSign, Calendar, User } from 'lucide-react';
import bwmLogo from 'figma:asset/0d1febf7746d940532ad6ebe58464b3c717cca4a.png';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

const menuItems = [
  { id: 'donations', icon: History, label: 'Donation History', screen: 'donation-history' },
  { id: 'membership', icon: CreditCard, label: 'My Membership Card', screen: 'membership' },
  { id: 'edit-profile', icon: UserIcon, label: 'Edit Profile', screen: 'edit-profile' },
  { id: 'settings', icon: Settings, label: 'Settings', screen: 'settings' },
];

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { user, signOut } = useAuth();

  // Refresh user data when component mounts or when navigating back
  useEffect(() => {
    const refreshUser = async () => {
      try {
        // Get fresh user data including email (just like full_name from metadata)
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        if (freshUser) {
          // The auth context will automatically update via onAuthStateChange
          // This ensures we have the latest email and all user data after phone verification
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };
    refreshUser();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    onNavigate('login');
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'Not provided';
  const userPhone = user?.user_metadata?.phone_number || 'Not provided';
  const userAddressLine1 = user?.user_metadata?.address_line1 || '';
  const userAddressLine2 = user?.user_metadata?.address_line2 || '';
  const userPostcode = user?.user_metadata?.postcode || '';
  const userCity = user?.user_metadata?.city || '';
  const userState = user?.user_metadata?.state || '';
  const userInitial = userName.charAt(0).toUpperCase();
  
  // Format full address
  const formatAddress = () => {
    const parts = [];
    if (userAddressLine1) parts.push(userAddressLine1);
    if (userAddressLine2) parts.push(userAddressLine2);
    if (userPostcode || userCity || userState) {
      const locationParts = [];
      if (userPostcode) locationParts.push(userPostcode);
      if (userCity) locationParts.push(userCity);
      if (userState) locationParts.push(userState);
      if (locationParts.length > 0) {
        parts.push(locationParts.join(', '));
      }
    }
    return parts.length > 0 ? parts.join(', ') : 'Not provided';
  };
  
  const fullAddress = formatAddress();

  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* TOP-LEVEL: Main App Header (NO Back Button) */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={bwmLogo} alt="BWM Logo" className="w-10 h-10 rounded-xl" />
        </div>
        <button className="text-[#FFFBEA]">
          <Bell size={24} />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-24">
        {/* User Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#0A402F] rounded-full flex items-center justify-center">
              <span className="text-[#FFFBEA] font-['Lora'] text-xl">{userInitial}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-[#333333] font-['Lora'] mb-1">{userName}</h3>
              <p className="text-[#333333] opacity-70 text-sm">{userEmail}</p>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="border-t pt-4 mt-4 space-y-3">
            <div>
              <p className="text-[#333333] opacity-60 text-xs mb-1">Email Address</p>
              <p className="text-[#333333] font-medium text-sm">{userEmail}</p>
            </div>
            <div>
              <p className="text-[#333333] opacity-60 text-xs mb-1">Phone Number</p>
              <p className="text-[#333333] font-medium text-sm">{userPhone}</p>
            </div>
            <div>
              <p className="text-[#333333] opacity-60 text-xs mb-1">Address</p>
              <p className="text-[#333333] font-medium text-sm">{fullAddress}</p>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.screen)}
              className={`w-full flex items-center justify-between p-4 hover:bg-[#0A402F]/5 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="text-[#0A402F]" size={20} />
                <span className="text-[#333333] font-['Inter']">{item.label}</span>
              </div>
              <ChevronRight className="text-[#333333] opacity-50" size={20} />
            </button>
          ))}
        </div>

        {/* Log Out Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:bg-[#d4183d]/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <LogOut className="text-[#d4183d]" size={20} />
            <span className="text-[#d4183d] font-['Inter']">Log Out</span>
          </div>
          <ChevronRight className="text-[#d4183d] opacity-50" size={20} />
        </button>
      </main>

      {/* TOP-LEVEL: Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Home size={24} />
            <span className="text-xs font-['Inter']">Home</span>
          </button>
          
          <button 
            onClick={() => onNavigate('donate')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <DollarSign size={24} />
            <span className="text-xs font-['Inter']">Donate</span>
          </button>
          
          <button 
            onClick={() => onNavigate('events')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Calendar size={24} />
            <span className="text-xs font-['Inter']">Events</span>
          </button>
          
          <button 
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center gap-1 text-[#0A402F]"
          >
            <User size={24} />
            <span className="text-xs font-['Inter']">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
