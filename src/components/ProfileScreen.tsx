import { ChevronRight, CreditCard, History, Settings, LogOut, Bell, User as UserIcon, Home, DollarSign, Calendar, User, Ticket, MapPin } from 'lucide-react';
import bwmLogo from '../assets/BWM logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchUserRegisteredEvents } from '../services/eventService';
import { Event } from '../types/event';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
  onSelectEvent?: (event: Event) => void;
}

const menuItems = [
  { id: 'tickets', icon: Ticket, label: 'My Tickets', screen: 'my-tickets' },
  { id: 'donations', icon: History, label: 'Donation History', screen: 'donation-history' },
  { id: 'membership', icon: CreditCard, label: 'My Membership Card', screen: 'membership' },
  { id: 'edit-profile', icon: UserIcon, label: 'Edit Profile', screen: 'edit-profile' },
  { id: 'settings', icon: Settings, label: 'Settings', screen: 'settings' },
];

export function ProfileScreen({ onNavigate, onSelectEvent }: ProfileScreenProps) {
  const { user, signOut } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState<Partial<Event>[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

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

// Fetch user's registered events
  useEffect(() => {
    const loadRegisteredEvents = async () => {
      setLoadingEvents(true);
      const { data } = await fetchUserRegisteredEvents(user?.id, user?.email || undefined);
      setRegisteredEvents(data || []);
      setLoadingEvents(false);
    };
    loadRegisteredEvents();
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

        {/* My Registered Events */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-[#333333] font-['Lora'] text-lg" style={{ fontWeight: 600 }}>My Registered Events</h3>
          </div>

          {loadingEvents ? (
            <div className="p-6 text-center">
              <div className="w-6 h-6 border-2 border-[#0A402F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm font-['Inter']">Loading events...</p>
            </div>
          ) : registeredEvents.length === 0 ? (
            <div className="p-6 text-center">
              <Calendar size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm font-['Inter']">No registered events yet</p>
              <button
                onClick={() => onNavigate('events')}
                className="mt-3 text-[#0A402F] text-sm font-['Inter']" style={{ fontWeight: 600 }}
              >
                Browse Events →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {registeredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    onSelectEvent?.(event);
                    onNavigate('event-details');
                  }}
                >
                  <img
                    src={event.poster_url}
                    alt={event.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#333333] font-['Inter'] text-sm font-medium truncate">{event.title}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar size={12} className="text-[#0A402F]" />
                      <span className="text-gray-500 text-xs font-['Inter']">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-[#0A402F]" />
                      <span className="text-gray-500 text-xs font-['Inter'] truncate">{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-white bg-[#0A402F] px-2 py-1 rounded-lg font-['Inter']">Registered</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.screen)}
              className={`w-full flex items-center justify-between p-4 hover:bg-[#0A402F]/5 transition-colors 
                ${index !== menuItems.length - 1 ? 'border-b border-gray-200' : ''
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
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
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
