import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { MembershipViewCard } from './components/MembershipViewCard';
import { MembershipRegistration } from './components/MembershipRegistration';
import { MembershipSuccess } from './components/MembershipSuccess';
import { MembershipRenewalPayment } from './components/MembershipRenewalPayment';
import { EventsList } from './components/EventsList';
import { EventDetails } from './components/EventDetails';
import { EventRegistration } from './components/EventRegistration';
import { DonateScreen } from './components/DonateScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { DonationHistory } from './components/DonationHistory';
import { EditProfileScreen } from './components/EditProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AIAssistant } from './components/AIAssistant';
import { HeritagePassport } from './components/HeritagePassport';
import { HeritageJournal } from './components/HeritageJournal';
import { CommunityWall } from './components/CommunityWall';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { AddressCompletionScreen } from './components/AddressCompletionScreen';
import { MyTicketsScreen } from './components/MyTicketsScreen';
import { AdminScannerScreen } from './components/AdminScannerScreen';
import { EventPaymentSelection } from './components/EventPaymentSelection';
import { EventPaymentSuccess } from './components/EventPaymentSuccess';
import { DonationDetailsScreen } from './components/DonationDetailsScreen';
import { FPXPaymentPage } from './components/FPXPaymentPage';
import { CardPaymentPage } from './components/CardPaymentPage';
import { GrabPayPaymentPage } from './components/GrabPayPaymentPage';
import { useAuth } from './contexts/AuthContext';
import { Event, RegistrationFormData } from './types/event'
import { donationService } from './services/donationService';
import { dummyEvents } from './services/eventService';

type Screen =
  | 'login'
  | 'signup'
  | 'address-completion'
  | 'home'
  | 'membership'
  | 'membership-register'
  | 'membership-success'
  | 'events'
  | 'event-details'
  | 'event-registration'
  | 'donate'
  | 'profile'
  | 'leaderboard'
  | 'donation-history'
  | 'edit-profile'
  | 'ai-assistant'
  | 'heritage-passport'
  | 'my-events'
  | 'my-tickets'
  | 'settings'
  | 'community-wall'
  | 'admin-scanner'
  | 'membership-renewal-payment'
  | 'donation-details'
  | 'payment-fpx'
  | 'payment-card'
  | 'payment-card'
  | 'payment-grabpay'
  | 'event-payment-selection'
  | 'event-payment-success';

export default function App() {
  const { user, loading, isConfigured, isAddressComplete } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('general');
  const [donationAmount, setDonationAmount] = useState<number>(50);

  // Event payment state
  const [eventPaymentData, setEventPaymentData] = useState<{
    amount: number;
    eventId: string;
    formData: RegistrationFormData | null;
  }>({ amount: 0, eventId: '', formData: null });

  useEffect(() => {
    // Redirect based on authentication state (only if Supabase is configured)
    if (!loading && isConfigured) {
      if (user) {
        // User is logged in and coming from signup, go directly to home (skip address check)
        if (currentScreen === 'signup') {
          setCurrentScreen('home');
        }
        // If user just logged in, check address completion
        else if (justLoggedIn && currentScreen === 'login') {
          const addressComplete = isAddressComplete();

          // If address is not complete after login, redirect to address completion
          if (!addressComplete) {
            setCurrentScreen('address-completion');
          } else {
            // Address is complete, go to home
            setCurrentScreen('home');
          }
          setJustLoggedIn(false);
        }
        // If user is on other screens, let them navigate freely
        // (address check only happens on login, not during normal navigation)
      } else {
        // User is not logged in, show login
        if (currentScreen !== 'login' && currentScreen !== 'signup' && currentScreen !== 'address-completion') {
          setCurrentScreen('login');
        }
        setJustLoggedIn(false);
      }
    }
    // If Supabase is not configured, allow navigation to home for demo mode
    else if (!loading && !isConfigured && currentScreen === 'login') {
      // Allow user to continue as guest
    }
  }, [user, loading, isConfigured, currentScreen, justLoggedIn, isAddressComplete]);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);

    // Update active tab for bottom navigation
    if (['home', 'donate', 'events', 'profile'].includes(screen)) {
      setActiveTab(screen);
    }
  };

  // Wrapper for components that use the simple signature
  const handleNavigateSimple = (screen: string) => {
    // Clear selected event when navigating away from event screens
    if (screen !== 'event-details' && screen !== 'event-registration') {
      setSelectedEvent(null);
    }
    handleNavigate(screen);
  };

  const handleDonateNavigate = (screen: string, params?: { campaignId: string }) => {
    if (params?.campaignId) {
      setSelectedCampaignId(params.campaignId);
    }
    handleNavigateSimple(screen);
  };

  // Handler for selecting an event
  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  // Helper to record donation
  const handlePaymentSuccess = async (method: 'fpx' | 'card' | 'grabpay') => {
    try {
      await donationService.addDonation(donationAmount, method, selectedCampaignId);
      alert('Payment Successful! Thank you for your donation.');
      handleNavigateSimple('home');
    } catch (error) {
      console.error('Donation record failed', error);
      alert('Payment Successful, but failed to record in leaderboard. Please contact support.');
      handleNavigateSimple('home');
    }
  };

  // Handler for event payment - show selection screen first
  const handleEventProceedToPayment = (amount: number, _method: string, eventId: string, formData: RegistrationFormData) => {
    setEventPaymentData({ amount, eventId, formData });
    handleNavigateSimple('event-payment-selection');
  };

  // Handler for confirmed payment method from selection screen
  const handleEventPaymentMethodConfirmed = (method: string) => {
    if (method === 'fpx') handleNavigateSimple('payment-fpx');
    else if (method === 'card') handleNavigateSimple('payment-card');
    else if (method === 'grabpay') handleNavigateSimple('payment-grabpay');
  };

  // Handler for event payment success
  const handleEventPaymentSuccess = async (_method: 'fpx' | 'card' | 'grabpay') => {
    if (!eventPaymentData.formData) {
      alert('Payment error: No registration data');
      return;
    }
    const { registerForEvent } = await import('./services/eventService');
    const { error } = await registerForEvent(
      eventPaymentData.eventId,
      eventPaymentData.formData,
      user?.id,
      !!user
    );
    if (error) {
      alert('Registration failed: ' + error.message);
    } else {
      alert('Payment successful! Registration complete.');
      // Keep eventPaymentData for the success screen
      handleNavigateSimple('event-payment-success');
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-[#FFFBEA] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0A402F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#333333] opacity-70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-[#FFFBEA] min-h-screen">
      {currentScreen === 'login' && (
        <LoginScreen
          onNavigate={handleNavigateSimple}
          onLoginSuccess={() => setJustLoggedIn(true)}
        />
      )}

      {currentScreen === 'signup' && (
        <SignUpScreen onNavigate={handleNavigate} />
      )}

      {currentScreen === 'address-completion' && (
        <AddressCompletionScreen
          onNavigate={handleNavigate}
          onComplete={() => {
            handleNavigate('home');
          }}
          isNewUser={!user?.user_metadata?.phone_verified}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen onNavigate={handleDonateNavigate} activeTab={activeTab} />
      )}

      {currentScreen === 'membership' && (
        <MembershipViewCard onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'membership-register' && (
        <MembershipRegistration onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'membership-success' && (
        <MembershipSuccess onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'events' && (
        <EventsList
          onNavigate={handleNavigateSimple}
          onSelectEvent={handleSelectEvent}
        />
      )}

      {currentScreen === 'event-details' && selectedEvent && (
        <EventDetails
          onNavigate={handleNavigateSimple}
          event={selectedEvent}
        />
      )}

      {currentScreen === 'event-registration' && selectedEvent && (
        <EventRegistration
          onNavigate={handleNavigateSimple}
          event={selectedEvent}
          onProceedToPayment={handleEventProceedToPayment}
        />
      )}

      {currentScreen === 'event-payment-selection' && (
        (() => {
          // Fallback: if selectedEvent is missing (e.g. refresh), try to find it by ID
          const eventToRender = selectedEvent || dummyEvents.find(e => e.id === eventPaymentData.eventId);

          if (eventToRender && eventPaymentData.formData) {
            return (
              <EventPaymentSelection
                onProceed={handleEventPaymentMethodConfirmed}
                onBack={() => handleNavigateSimple('event-registration')}
                event={eventToRender}
                registrationData={eventPaymentData.formData}
                amount={eventPaymentData.amount}
              />
            );
          }

          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <p className="text-red-500 mb-2">Error: Missing event or registration data.</p>
                <button
                  onClick={() => handleNavigateSimple('events')}
                  className="text-[#0A402F] underline"
                >
                  Return to Events
                </button>
              </div>
            </div>
          );
        })()
      )}

      {currentScreen === 'event-payment-success' && (
        (() => {
          const eventToRender = selectedEvent || dummyEvents.find(e => e.id === eventPaymentData.eventId);

          if (eventToRender && eventPaymentData.formData) {
            return (
              <EventPaymentSuccess
                onNavigate={handleNavigateSimple}
                event={eventToRender}
                registrationData={eventPaymentData.formData}
                amount={eventPaymentData.amount}
              />
            );
          }
          // Fail safe
          return null;
        })()
      )}

      {currentScreen === 'leaderboard' && (
        <LeaderboardScreen onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'donation-history' && (
        <DonationHistory onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'ai-assistant' && (
        <AIAssistant onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'heritage-passport' && (
        <HeritagePassport onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'my-events' && (
        <HeritageJournal onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'community-wall' && (
        <CommunityWall onNavigate={handleNavigateSimple} />
      )}

      {/* Placeholder screens for donate and settings */}
      {currentScreen === 'donate' && (
        <DonateScreen onNavigate={handleDonateNavigate} />
      )}

      {currentScreen === 'edit-profile' && (
        <EditProfileScreen onNavigate={handleNavigate} />
      )}

      {currentScreen === 'my-tickets' && (
        <MyTicketsScreen onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'admin-scanner' && (
        <AdminScannerScreen onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'membership-renewal-payment' && (
        <MembershipRenewalPayment onNavigate={handleNavigateSimple} />
      )}

      {/* Donation Flow Screens */}
      {currentScreen === 'donation-details' && (
        <DonationDetailsScreen
          data={{ campaignId: selectedCampaignId }}
          onProceed={(amount, method) => {
            setDonationAmount(amount);
            if (method === 'fpx') handleNavigateSimple('payment-fpx');
            if (method === 'card') handleNavigateSimple('payment-card');
            if (method === 'grabpay') handleNavigateSimple('payment-grabpay');
          }}
          onBack={() => handleNavigateSimple('donate')}
        />
      )}

      {currentScreen === 'payment-fpx' && (
        <FPXPaymentPage
          amount={eventPaymentData.formData ? eventPaymentData.amount : donationAmount}
          onBack={() => handleNavigateSimple(eventPaymentData.formData ? 'event-payment-selection' : 'donation-details')}
          onSuccess={() => eventPaymentData.formData ? handleEventPaymentSuccess('fpx') : handlePaymentSuccess('fpx')}
        />
      )}

      {currentScreen === 'payment-card' && (
        <CardPaymentPage
          amount={eventPaymentData.formData ? eventPaymentData.amount : donationAmount}
          onBack={() => handleNavigateSimple(eventPaymentData.formData ? 'event-payment-selection' : 'donation-details')}
          onSuccess={() => eventPaymentData.formData ? handleEventPaymentSuccess('card') : handlePaymentSuccess('card')}
        />
      )}

      {currentScreen === 'payment-grabpay' && (
        <GrabPayPaymentPage
          amount={eventPaymentData.formData ? eventPaymentData.amount : donationAmount}
          onBack={() => handleNavigateSimple(eventPaymentData.formData ? 'event-payment-selection' : 'donation-details')}
          onSuccess={() => eventPaymentData.formData ? handleEventPaymentSuccess('grabpay') : handlePaymentSuccess('grabpay')}
        />
      )}
    </div>
  );
}
