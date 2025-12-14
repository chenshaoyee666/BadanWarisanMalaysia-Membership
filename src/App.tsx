import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { MembershipViewCard } from './components/MembershipViewCard';
import { MembershipRegistration } from './components/MembershipRegistration';
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
import { useAuth } from './contexts/AuthContext';
import { Event } from './types/event';

type Screen = 
  | 'login'
  | 'signup'
  | 'address-completion'
  | 'home' 
  | 'membership' 
  | 'membership-register' 
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
  | 'settings'
  | 'community-wall';

export default function App() {
  const { user, loading, isConfigured, isAddressComplete } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

  const handleNavigate = (screen: string, phone?: string, isSignUp?: boolean) => {
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

  // Handler for selecting an event
  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
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
        <HomeScreen onNavigate={handleNavigateSimple} activeTab={activeTab} />
      )}
      
      {currentScreen === 'membership' && (
        <MembershipViewCard onNavigate={handleNavigateSimple} />
      )}
      
      {currentScreen === 'membership-register' && (
        <MembershipRegistration onNavigate={handleNavigateSimple} />
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
        />
      )}

      {currentScreen === 'leaderboard' && (
        <LeaderboardScreen onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen onNavigate={handleNavigateSimple} onSelectEvent={handleSelectEvent} />
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
        <DonateScreen onNavigate={handleNavigateSimple} />
      )}

      {currentScreen === 'edit-profile' && (
        <EditProfileScreen onNavigate={handleNavigate} />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen onNavigate={handleNavigateSimple} />
      )}
    </div>
  );
}
