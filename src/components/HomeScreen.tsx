import { Bell, Heart, Calendar, Trophy, HelpCircle, Home, DollarSign, User, Menu, X, Award, MessageSquare, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import bwmLogo from '../assets/BWM logo.png';
import { useAuth } from '../contexts/AuthContext';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  activeTab: string;
}

export function HomeScreen({ onNavigate, activeTab }: HomeScreenProps) {
  const { user } = useAuth();
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // Get user's full name from metadata
  const userName = user?.user_metadata?.full_name || 'User';

  return (
    <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
      {/* Quick Access Menu */}
      {showQuickMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowQuickMenu(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#333333] font-['Lora']">Quick Access</h3>
              <button onClick={() => setShowQuickMenu(false)} className="text-[#333333]">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  onNavigate('heritage-passport');
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-3 p-4 bg-[#FEFDF5] rounded-xl hover:bg-[#0A402F]/5 transition-colors"
              >
                <Award className="text-[#B8860B]" size={24} />
                <div className="text-left">
                  <p className="text-[#333333]">Heritage Passport</p>
                  <p className="text-[#333333] opacity-70">Track your heritage visits</p>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigate('my-events');
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-3 p-4 bg-[#FEFDF5] rounded-xl hover:bg-[#0A402F]/5 transition-colors"
              >
                <BookOpen className="text-[#B8860B]" size={24} />
                <div className="text-left">
                  <p className="text-[#333333]">My Journal</p>
                  <p className="text-[#333333] opacity-70">Document your experiences</p>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigate('community-wall');
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-3 p-4 bg-[#FEFDF5] rounded-xl hover:bg-[#0A402F]/5 transition-colors"
              >
                <MessageSquare className="text-[#B8860B]" size={24} />
                <div className="text-left">
                  <p className="text-[#333333]">Community Wall</p>
                  <p className="text-[#333333] opacity-70">Read supporter messages</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={bwmLogo} alt="BWM Logo" className="w-10 h-10 rounded-xl" />
          <span className="absolute left-1/2 transform -translate-x-1/2 text-white text-xl font-semibold">
            WarisanXpress
          </span>
        </div>
        <button className="text-white">
          <Bell size={24} />
        </button>
      </header>


      {/* Main Content */}
      <main className="flex-1 px-4 pb-24 overflow-y-auto">
        {/* Welcome Text */}
        <div className="mt-6 mb-6">
          <h1 style={{ fontSize: '30px', fontFamily: 'Lora', color: '#333333' }}
          >
            Hi {userName} !
          </h1>
          <p style={{ fontSize: '18px', fontFamily: 'Pacifico, cursive', color: '#333333', opacity: 0.8, marginTop: '8px' }}
            >
            Welcome back to your heritage journey
            </p>
          </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            className="bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FEFDF5] h-14 rounded-xl"
            onClick={() => onNavigate('donate')}
          >
            <Heart className="mr-2" size={20} />
            Donate Now
          </Button>
          <Button
            variant="outline"
            className="border-2 border-[#0A402F] text-[#0A402F] hover:bg-[#0A402F]/5 h-14 rounded-xl"
            onClick={() => onNavigate('membership-register')}
          >
            Membership
          </Button>
        </div>

        {/* Icon Menu */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => onNavigate('events')}
            className="bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Calendar className="text-[#333333] mb-2" size={32} />
            <span className="text-[#333333]">Events</span>
          </button>

          <button
            onClick={() => onNavigate('leaderboard')}
            className="bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Trophy className="text-[#333333] mb-2" size={32} />
            <span className="text-[#333333]">Leaderboard</span>
          </button>

          <button
            onClick={() => onNavigate('ai-assistant')}
            className="bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="text-[#333333] mb-2" size={32} />
            <span className="text-[#333333]">AI Help</span>
          </button>
        </div>

        {/* Campaign Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1593857389276-7c794900c90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxheXNpYW4lMjBoZXJpdGFnZSUyMHRyYWRpdGlvbmFsJTIwaG91c2V8ZW58MXx8fHwxNzYyNDE0NjIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Rumah Penghulu"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-[#333333] font-['Lora'] mb-2">Rumah Penghulu Restoration</h3>
            <p className="text-[#333333] opacity-70 mb-4">Help us preserve this historic traditional Malay house for future generations</p>

            <div className="mb-2">
              <div className="flex justify-between mb-2">
                <span className="text-[#333333]">RM15,000</span>
                <span className="text-[#333333] opacity-70">RM20,000</span>
              </div>
              <Progress value={75} className="h-2 bg-[#FEFDF5]" indicatorClassName="bg-[#B8860B]" />
            </div>

            <Button className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FEFDF5] mt-2 rounded-lg">
              Support Campaign
            </Button>
          </div>
        </div>

        {/* Community Wall Feature */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-[#333333] font-['Lora'] mb-2">Community Voices</h3>
          <div className="bg-[#FEFDF5] rounded-xl p-4 mb-4 border-l-4 border-[#B8860B]">
            <p className="text-[#333333] opacity-70 italic">
              "So important to protect this piece of our history for our children!"
            </p>
            <p className="text-[#333333] mt-2">- Ahmad I.</p>
          </div>
          <button
            onClick={() => onNavigate('community-wall')}
            className="text-[#0A402F] hover:underline"
          >
            View all community messages →
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-[#0A402F]' : 'text-gray-400'}`}
          >
            <Home size={24} />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => onNavigate('donate')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'donate' ? 'text-[#0A402F]' : 'text-gray-400'}`}
          >
            <DollarSign size={24} />
            <span className="text-xs">Donate</span>
          </button>

          <button
            onClick={() => onNavigate('events')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'events' ? 'text-[#0A402F]' : 'text-gray-400'}`}
          >
            <Calendar size={24} />
            <span className="text-xs">Events</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-[#0A402F]' : 'text-gray-400'}`}
          >
            <User size={24} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      {/* Floating Quick Access Button */}
      <button
        onClick={() => setShowQuickMenu(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-[#B8860B] hover:bg-[#B8860B]/90 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-40"
      >
        <Menu size={24} />
      </button>
    </div>
  );
}
